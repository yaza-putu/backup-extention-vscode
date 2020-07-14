# Visual Studio Code Jasmine Snippets ES5
This code snippets is inspired by [Sublime Jasmine Snippets](https://github.com/caiogondim/jasmine-sublime-snippets) with some trigger modifications.

## Installation
Type `cmd-shift-p`/`ctrl-shift-p` to launch command palette and choose `Extensions: Install Extension`. Search this package and install.

## Snippets
Below is a list of all snippets and the triggers.

*The ⇥ means the TAB key.*

### Specs
| Trigger  | Description |
| -------  | ----------- |
| `desc→`  | describe method |
| `xdesc→` | xdescribe method |
| `fdesc→` | fdescribe method |
| `it→`    | it method |
| `xit→`   | xit method |
| `fit→`   | fit method |
| `ba→`    | before all method |
| `aa→`    | after all method |
| `be→`    | before each method |
| `ae→`    | after each method |

### Expectations
| Trigger  | Description |
| -------  | ----------- |
| `exp→` 	 | expect |
| `tb→`    | expect().toBe |
| `tbct→`  | expect().toBeCloseTo |
| `tbd→`   | expect().toBeDefined |
| `tbf→`   | expect().toBeFalsy |
| `tbgt→`  | expect().toBeGreaterThan |
| `tblt→`  | expect().toBeLessThan |
| `tbn→`   | expect().toBeNul |
| `tbt→`   | expect().toBeTruthy |
| `tbu→`   | expect().toBeUndefined |
| `tc→`    | expect().toContain |
| `te→`    | expect().toEqual |
| `thbc→`  | expect().toHaveBeenCalled |
| `thbcw→` | expect().toHaveBeenCalledWith |
| `tm→`    | expect().toMatch |
| `tt→`    | expect().toThrow |
| `tte→`   | expect().toThrowError |
| `nb→`    | expect().not.toBe |
| `nbct→`  | expect().not.toBeCloseTo |
| `nbd→`   | expect().not.toBeDefined |
| `nbf→`   | expect().not.toBeFalsy |
| `nbgt→`  | expect().not.toBeGreaterThan |
| `nblt→`  | expect().not.toBeLessThan |
| `nbn→`   | expect().not.toBeNull |
| `nbt→`   | expect().not.toBeTruthy |
| `nbu→`   | expect().not.toBeUndefined |
| `nc→`    | expect().not.toContain |
| `ne→`    | expect().not.toEqual |
| `nm→`    | expect().not.toMatch |
| `nt→`    | expect().not.toThrow |
| `any→`   | jasmine.any |
| `oc→`    | jasmine.objectContaining |

### Spies
| Trigger  | Content |
| -------  | ------- |
| `so→`    | spyOn |
| `soct→`  | spyOn.and.callThrough |
| `socf→`  | spyOn.and.callFake |
| `sorv→`  | spyOn.and.returnValue |
| `sos→`   | spyOn.and.stub |
| `sote→`  | spyOn.and.throwError |
| `sca→`   | spy.calls.all |
| `scaa→`  | spy.calls.allArgs |
| `scan→`  | spy.calls.any |
| `scaf→`  | spy.calls.argsFor |
| `scc→`   | spy.calls.count |
| `scf→`   | spy.calls.first |
| `scmr→`  | spy.calls.mostRecent |
| `scr→`   | spy.calls.reset |
| `cs→`    | createSpy |
| `cso→`   | createSpyObj |

## License
[MIT License](http://opensource.org/licenses/MIT)
