import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const states = [...readFileSync(new URL("../src/lib/site.ts", import.meta.url), "utf8").matchAll(/slug: "([a-z-]+)"/g)]
  .map((match) => ({ slug: match[1] }));
const source = readFileSync(new URL("../src/lib/tracking.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });

function harness() {
  const calls = [];
  let onClick;
  class Element {
    constructor(link) { this.link = link; }
    closest() { return this.link; }
  }
  const window = {
    location: new URL("https://lawsuitstatusguide.com/lawsuits/roundup/"),
    gtag: (...args) => calls.push(args)
  };
  vm.runInNewContext(outputText, {
    exports: {}, URL, Element, window,
    require: (name) => { assert.equal(name, "./site"); return { states }; },
    document: { addEventListener: (event, handler) => { assert.equal(event, "click"); onClick = handler; } }
  });
  return {
    window,
    click(href, attributes = {}) {
      calls.length = 0;
      const link = {
        href: new URL(href, window.location.href).href,
        dataset: {}, rel: "", textContent: "Example link",
        getAttribute: (name) => name === "href" ? href : null,
        ...attributes
      };
      onClick({ target: new Element(link) });
      return calls.map((call) => call[1]);
    },
    nonElementClick() { onClick({ target: {} }); }
  };
}

test("only actual state slugs count as state guides", () => {
  const h = harness();
  for (const { slug } of states) {
    assert.deepEqual(h.click(`/lawsuits/roundup/${slug}/`), ["state_guide_click"]);
    assert.deepEqual(h.click(`https://lawsuitstatusguide.com/lawsuits/roundup/${slug}?ref=test`), ["state_guide_click"]);
  }
});

test("records, deadlines and settlement guides have their own event", () => {
  const h = harness();
  for (const href of ["/lawsuits/roundup/proof/", "/lawsuits/roundup/deadline/", "/lawsuits/cook-ivc-filter/device-records/", "/lawsuits/exactech/recall-records/", "/lawsuits/afff-pfas/settlement/", "/lawsuits/suboxone/tooth-decay/", "/lawsuits/bard-powerport/settlement-amounts/"]) {
    assert.deepEqual(h.click(href), ["supporting_guide_click"]);
  }
});

test("internal absolute links and external lookalike paths are classified correctly", () => {
  const h = harness();
  assert.deepEqual(h.click("https://lawsuitstatusguide.com/settlements/"), ["settlement_tracker_click"]);
  assert.deepEqual(h.click("/deadlines?ref=test"), ["deadline_tracker_click"]);
  assert.deepEqual(h.click("/mdl/3044/"), ["mdl_click"]);
  assert.deepEqual(h.click("https://example.com/lawsuits/roundup/illinois/"), ["source_click"]);
  assert.deepEqual(h.click("#latest-update"), ["section_navigation"]);
});

test("explicit events retain priority and unavailable analytics does not break navigation", () => {
  const h = harness();
  assert.deepEqual(h.click("/lawsuits/exactech/#settlement-status", { dataset: { track: "mdl_to_lawsuit" } }), ["mdl_to_lawsuit"]);
  assert.deepEqual(h.click("mailto:contact@example.com"), ["contact_click"]);
  assert.deepEqual(h.click("tel:5551234567"), ["phone_click"]);
  assert.deepEqual(h.click("https://example.com", { rel: "sponsored" }), ["sponsor_click"]);
  h.window.gtag = undefined;
  assert.deepEqual(h.click("/deadlines/"), []);
  assert.doesNotThrow(() => h.nonElementClick());
});
