jest.mock(__base + 'dao/workflows.dao');
require(__base + 'delegates/user-access.delegate.mocked');

const workflowsDao = require(__base + 'dao/workflows.dao');
const workflowsDelegate = require('./workflows.delegate');


describe('Workflows delegate', () => {
    workflowsDao.create.mockImplementation((cache) => Promise.resolve({ id: 1, ...cache }));
    workflowsDao.get.mockReturnValue(Promise.resolve({}));
    workflowsDao.getAll.mockReturnValue(Promise.resolve({}));
    workflowsDao.update.mockReturnValue(Promise.resolve({}));
    workflowsDao.deleteWorkflow.mockReturnValue(Promise.resolve({}));

    test('Workflows should call all CRUD functions', async () => {
        let workflow = {
            id_project: 1,
            data: {
                name: "name"
            }
        };

        let newworkflow = await workflowsDelegate.create(workflow);
        expect(workflowsDao.create).toBeCalled();

        await workflowsDelegate.get(newworkflow.id);
        expect(workflowsDao.get).toBeCalled();

        await workflowsDelegate.getAll();
        expect(workflowsDao.getAll).toBeCalled();

        await workflowsDelegate.update(newworkflow, newworkflow.id);
        expect(workflowsDao.update).toBeCalled();

        await workflowsDelegate.deleteWorkflow(newworkflow.id);
        expect(workflowsDao.deleteWorkflow).toBeCalled();
    });

    test('Workflows create should rise error because wrong id_project given', async () => {
        let workflow = {
            id_project: 'a',
            data: {
                name: "name"
            }
        };

        await expect(workflowsDelegate.create(workflow)).rejects.toThrow();
    });

    test('Workflows get should rise error because of wrong id params', async () => {
        await expect(workflowsDelegate.get({})).rejects.toThrow();
        await expect(workflowsDelegate.get('a')).rejects.toThrow();
    });
});