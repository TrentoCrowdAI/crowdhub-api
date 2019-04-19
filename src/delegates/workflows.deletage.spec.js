jest.mock(__base + 'dao/workflows.dao');

const workflowsDao = require(__base + 'dao/workflows.dao');
const workflowsDelegate = require('./workflows.delegate');

describe('Workflows delegate', () => {
    workflowsDao.create.mockReturnValue(Promise.resolve({}));
    workflowsDao.get.mockReturnValue(Promise.resolve({}));
    workflowsDao.getAll.mockReturnValue(Promise.resolve({}));
    workflowsDao.update.mockReturnValue(Promise.resolve({}));
    workflowsDao.deleteWorkflow.mockReturnValue(Promise.resolve({}));

    test('Workflows tester', () => {
        let workflow = {};

        workflowsDelegate.create(workflow);
        expect(workflowsDao.create).toBeCalled();

        workflowsDelegate.get(1);
        expect(workflowsDao.get).toBeCalled();

        workflowsDelegate.getAll();
        expect(workflowsDao.getAll).toBeCalled();

        workflowsDelegate.update(workflow, 1);
        expect(workflowsDao.update).toBeCalled();
        
        workflowsDelegate.deleteWorkflow(1);
        expect(workflowsDao.deleteWorkflow).toBeCalled();
    });
});