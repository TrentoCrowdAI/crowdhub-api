const projectsDelegate = require(__base + 'delegates/projects.delegate');
const itemsDelegate = require(__base + 'delegates/items.delegate');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');
const runsDelegate = require(__base + 'delegates/runs.delegate');
const cacheDelegate = require(__base + 'delegates/cache.delegate');
const { sleep } = require(__base + 'utils/utils');
const f8Helper = require(__base + 'utils/f8-helper');
const tolokaHelper = require(__base + 'utils/toloka-helper');

let example = __base + "../example/";
const workflowBase = require(example + 'workflows/workflow-base.json');

//set jest timeout to 15 minute
jest.setTimeout(1000 * 60 * 15);

describe('Workflow execution tests', () => {
    const blockId = '5e102960-790b-4d13-a58e-49573bd4e560';
    const userId = 'testUser';
    let delIds = [];

    test('Empty lambda block + F8 do block', async () => {
        //create the new project
        let proj = await projectsDelegate.create(workflowBase.project, userId);

        //create the items
        let items = { id_project: proj.id, items: workflowBase.items };
        items = await itemsDelegate.createItems(items);

        //create the workflow
        workflowBase.workflow.id_project = parseInt(proj.id);
        let workflow = await workflowsDelegate.create(workflowBase.workflow, userId);

        //test the estimation cost functions
        let cost = await workflowsDelegate.estimateDoBlockCost(workflow.id, blockId, userId);
        expect(typeof cost).toBe('number');

        //execute the workflow
        let result = await workflowsDelegate.start(workflow.id, userId);

        //test the result
        expect(typeof result).toBe("number");

        //check the status of the run periodically
        let wait = true;
        let cacheId;
        while (wait) {
            sleep(300);
            let run = await runsDelegate.get(result);
            if (run.data[blockId].state === 'finished') {
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
            let blockWaitId = blockId + '_wait';
            if (run.data[blockWaitId].state === 'finished') {
                wait = false;
                cacheId = run.data[blockWaitId].id_cache;
            }
        }

        //check the result
        let doWaitCache = await cacheDelegate.get(cacheId);
        expect(doWaitCache).toBeDefined();

        let runResult = await runsDelegate.getResult(result);
        expect(runResult).toBeDefined();

        delIds.push({
            workflowId: workflow.id,
            itemsId: items.map(x => x.id),
            projectId: proj.id
        });
    });

    test('Empty lambda block + Toloka do block', async () => {
        //create the new project
        let proj = await projectsDelegate.create(workflowBase.project, userId);

        //create the items
        let items = { id_project: proj.id, items: workflowBase.items };
        items = await itemsDelegate.createItems(items);

        //create the workflow
        workflowBase.workflow.id_project = parseInt(proj.id);
        //change platform to toloka
        workflowBase.workflow.data.graph.nodes[1].parameters.platform = 'toloka';
        let workflow = await workflowsDelegate.create(workflowBase.workflow, userId);

        //test the estimation cost functions
        let cost = await workflowsDelegate.estimateDoBlockCost(workflow.id, blockId, userId);
        expect(typeof cost).toBe('number');

        //execute the workflow
        let result = await workflowsDelegate.start(workflow.id, userId);

        //test the result
        expect(typeof result).toBe("number");

        //check the status of the run periodically
        let wait = true;
        let cacheId;
        while (wait) {
            sleep(300);
            let run = await runsDelegate.get(result);
            if (run.data[blockId].state === 'finished') {
                wait = false;
                cacheId = run.data[blockId].id_cache;
            }
        }

        //block do-publish is finished
        let doCache = await cacheDelegate.get(cacheId);

        //change the state of the rows to finished
        await tolokaHelper.closePool(doCache.data.result.taskPool.id, true);

        //check the status of the run periodically until is finished
        wait = true;
        while (wait) {
            sleep(5000);
            let run = await runsDelegate.get(result);
            let blockWaitId = blockId + '_wait';
            if (run.data[blockWaitId].state === 'finished') {
                wait = false;
                cacheId = run.data[blockWaitId].id_cache;
            }
        }

        //check the result
        let doWaitCache = await cacheDelegate.get(cacheId);
        expect(doWaitCache).toBeDefined();

        let runResult = await runsDelegate.getResult(result);
        expect(runResult).toBeDefined();

        delIds.push({
            workflowId: workflow.id,
            itemsId: items.map(x => x.id),
            projectId: proj.id
        });
    });

    afterAll(async () => {
        for (let id of delIds) {
            //delete the workflow
            await workflowsDelegate.deleteWorkflow(id.workflowId, userId);

            //delete the items
            for (let item of id.itemsId)
                await itemsDelegate.deleteItem(item);

            //delete project
            await projectsDelegate.deleteProject(id.projectId, userId);
        }
    });
});