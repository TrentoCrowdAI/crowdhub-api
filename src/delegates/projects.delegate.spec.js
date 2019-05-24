jest.mock(__base + 'dao/projects.dao');
require(__base + 'delegates/user-access.delegate.mocked');

const projectsDao = require(__base + 'dao/projects.dao');
const projectsDelegate = require('./projects.delegate');

describe('Projects delegate', () => {
    projectsDao.create.mockImplementation((project, userId) => Promise.resolve({ id: 1, id_user: userId, data: project }));
    projectsDao.get.mockReturnValue(Promise.resolve({}));
    projectsDao.getAll.mockReturnValue(Promise.resolve({}));
    projectsDao.update.mockReturnValue(Promise.resolve({}));
    projectsDao.deleteProject.mockReturnValue(Promise.resolve({}));

    test('Projects should call all CRUD functions', async () => {
        let project = {
            name: "name",
            description: "desc"
        };
        let userId = 'aaaa';

        let newproject = await projectsDelegate.create(project, userId);
        expect(projectsDao.create).toBeCalled();

        await projectsDelegate.get(newproject.id, userId);
        expect(projectsDao.get).toBeCalled();

        await projectsDelegate.getAll(userId);
        expect(projectsDao.getAll).toBeCalled();

        await projectsDelegate.update(newproject, newproject.id, userId);
        expect(projectsDao.update).toBeCalled();
        
        await projectsDelegate.deleteProject(newproject.id, userId);
        expect(projectsDao.deleteProject).toBeCalled();
    });

    test('Project create should rise error because of wrong parameters', async () => {
        let project = {
            name: "block",
            description: 1
        };
        let userId = 'aaaa';

        await expect(projectsDelegate.create(project, userId)).rejects.toThrow();
    });

    test('Project get should rise error because of wrong id params', async () => {
        let userId = 'aaaa';
        await expect(projectsDelegate.get({}, userId)).rejects.toThrow();
        await expect(projectsDelegate.get('a', userId)).rejects.toThrow();
    });
});