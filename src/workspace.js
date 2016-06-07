// @flow

/*:: import { Panel } from './panel';*/
/*:: import { PanelContentMediator } from './panel-content-mediator';*/
/*:: import { WorkspaceRepository } from './repo/workspace-repository';*/

class Workspace {
  /*:: id: string;*/
  /*:: title: string;*/
  /*:: panels: {[key: string]: Panel};*/
  /*:: panelStack: Panel[];*/
  /*:: repo: WorkspaceRepository;*/

  /**
   * @param {string} id
   * @param {Workspace~UpdateHandler} updateHandler
   * @param {WorkspaceRepository} repo
   */
  constructor(id/*: string*/, repo/*: WorkspaceRepository*/) {
    // TODO accept repository / persistence object

    /** @type {string} */
    this.id = id;

    /** @type {WorkspaceRepository} */
    this.repo = repo;

    /**@type {string} */
    this.title = 'Untitled';

    /** @type {Object.<string,Panel>} */
    this.panels = {};

    /**
     * Z-ordering of panels, with the top of the stack at the highest index (end of array).
     * If a panel is not a member of this list, then that panel is hidden or "minimized".
     * @type {Panel[]}
     */
    this.panelStack = [];
  }

  /**
   * Instantiates a new panel of the given type definition
   * @param {PanelContentMediator} contentMediator
   * @return {Promise.<Panel>}
   */
  createPanel/*:: <T>*/(contentMediator/*: PanelContentMediator*/, panelContent/*: T*/)/*: Promise<Panel<T>>*/ {
    let panelP = this.repo.createPanel(contentMediator, this, panelContent);

    panelP.then((panel) => {
      this.panels[panel.id] = panel;
      this.panelStack.push(panel);
    });

    return panelP;
  }

  /**
   * Removes the specified panel from this workspace if it exists
   * @param {Panel} panel
   */
  removePanel(panel/*: Panel*/)/*: void*/ {
    if (this.panels.hasOwnProperty(panel.id)) {
      delete this.panels[panel.id];
      this.repo.saveWorkspace(this);
    }

    let ix = this.panelStack.indexOf(panel);
    if (ix >= 0) {
      this.panelStack.splice(ix, 1);
    }
  }

  /**
   * Activates a panel by moving it to the top of the stack
   */
  activatePanel(panel/*: Panel*/)/*: void*/ {
    if (this.panels.hasOwnProperty(panel.id)) {
      let ix = this.panelStack.indexOf(panel);
      if (ix >= 0) {
        this.panelStack.splice(ix, 1);
      }
      this.panelStack.push(panel);
    }
  }
}

/**
 * @callback {Workspace~UpdateHandler}
 * @param {Workspace} workspace
 * @param {Panel} panel
 */

export { Workspace };
