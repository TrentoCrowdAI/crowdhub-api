const projectsDelegate = require(__base + 'delegates/projects.delegate');
const itemsDelegate = require(__base + 'delegates/items.delegate');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');
const runsDelegate = require(__base + 'delegates/runs.delegate');
const cacheDelegate = require(__base + 'delegates/cache.delegate');
const { sleep } = require(__base + 'utils/utils');
const f8Helper = require(__base + 'utils/f8-helper');

let example = __base + "../example/";
const workflowBase = require(example + 'workflows/workflow-base.json');

//set jest timeout to 15 minute
jest.setTimeout(1000 * 60 * 15);

describe('Workflow execution tests', () => {
    test('Empty lambda block + F8 do block', async () => {
        //create the new project
        let proj = await projectsDelegate.create(workflowBase.project);

        //create the items
        let items = { id_project: proj.id, items: workflowBase.items };
        items = await itemsDelegate.createItems(items);

        //create the workflow
        workflowBase.workflow.id_project = parseInt(proj.id);
        let workflow = await workflowsDelegate.create(workflowBase.workflow);

        //execute the workflow
        let result = await workflowsDelegate.start(workflow.id);

        //test the result
        expect(typeof result).toBe("number");

        //check the status of the run periodically
        let wait = true;
        let cacheId;
        while (wait) {
            sleep(300);
            let run = await runsDelegate.get(result);
            let blockId = '5e102960-790b-4d13-a58e-49573bd4e560';
            if (run.data[blockId].state === 'finished'){
                wait = false;
                cacheId = run.data[blockId].id_cache;
            }
        }

        //block do-publish is finished
        let doCache = await cacheDelegate.get(cacheId);

        //change the state of the rows to finished
        await f8Helper.finalizeAllRows(doCache.data.result.id);


        //check the status of the run periodically until is finished
        wait = true;
        while (wait) {
            sleep(5000);
            let run = await runsDelegate.get(result);
            let blockId = '5e102960-790b-4d13-a58e-49573bd4e560_wait';
            if (run.data[blockId].state === 'finished'){
                wait = false;
                cacheId = run.data[blockId].id_cache;
            }
        }

        //check the result
        let doWaitCache = await cacheDelegate.get(cacheId);
        expect(doWaitCache).toBeDefined();
        
        let runResult = await runsDelegate.getResult(result);
        expect(runResult).toBeDefined();

        //delete the workflow
        await workflowsDelegate.deleteWorkflow(workflow.id);

        //delete the items
        for (let item of items)
            await itemsDelegate.deleteItem(item.id);

        //delete project
        await projectsDelegate.deleteProject(proj.id);
    });
});