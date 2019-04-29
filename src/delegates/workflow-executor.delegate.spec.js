const projectsDelegate = require(__base + 'delegates/projects.delegate');
const itemsDelegate = require(__base + 'delegates/items.delegate');
const workflowsDelegate = require(__base + 'delegates/workflows.delegate');

let example = __base + "../example/";
const workflowBase = require(example + 'workflows/workflow-base.json');

//set jest timeout to 20 seconds
jest.setTimeout(20000);

describe('Workflow execution tests', () => {
    test('Empty lambda block + F8 do-publish block', async () => {
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
        expect(result).toBeInstanceOf(Array);
        expect(result[0]).toBeDefined();
        expect(result[0].id).toBeDefined();

        //delete the workflow
        await workflowsDelegate.deleteWorkflow(workflow.id);

        //delete the items
        for(let item of items)
            await itemsDelegate.deleteItem(item.id);
            
        //delete project
        await projectsDelegate.deleteProject(proj.id);
    });
});