jest.mock(__base + 'dao/runs.dao');

const runsDao = require(__base + 'dao/runs.dao');
const runsDelegate = require('./runs.delegate');

describe('Runs delegate', () => {
    runsDao.create.mockImplementation((run) => Promise.resolve({ id: 1, ...run }));
    runsDao.get.mockReturnValue(Promise.resolve({}));
    runsDao.getAll.mockReturnValue(Promise.resolve({}));
    runsDao.update.mockReturnValue(Promise.resolve({}));
    runsDao.deleteRun.mockReturnValue(Promise.resolve({}));

    test('Runs should call all CRUD functions', async () => {
        let run = {
            id_workflow : 1,
            data: {}
        };

        let newrun = await runsDelegate.create(run);
        expect(runsDao.create).toBeCalled();

        await runsDelegate.get(newrun.id);
        expect(runsDao.get).toBeCalled();

        await runsDelegate.getAll();
        expect(runsDao.getAll).toBeCalled();
        
        await runsDelegate.update(newrun, newrun.id);
        expect(runsDao.update).toBeCalled();

        await runsDelegate.deleteRun(newrun.id);
        expect(runsDao.deleteRun).toBeCalled();
    });

    test('Runs create should rise error because wrong id_workflow given', async () => {
        let run = {
            id_workflow : 'a',
            data: {}
        };

        await expect(runsDelegate.create(run)).rejects.toThrow();
    });

    test('Runs create should rise error because wrong data given', async () => {
        let run = {
            id_workflow : 1,
            data: []
        };

        await expect(runsDelegate.create(run)).rejects.toThrow();
    });

    test('Runs get should rise error because of wrong id params', async () => {
        await expect(runsDelegate.get({})).rejects.toThrow();
        await expect(runsDelegate.get('a')).rejects.toThrow();
    });
});