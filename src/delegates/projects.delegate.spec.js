jest.mock(__base + 'dao/projects.dao');

const projectsDao = require(__base + 'dao/projects.dao');
const projectsDelegate = require('./projects.delegate');

describe('Projects delegate', () => {
    projectsDao.create.mockImplementation((project) => Promise.resolve({ id: 1, data: project }));
    projectsDao.get.mockReturnValue(Promise.resolve({}));
    projectsDao.getAll.mockReturnValue(Promise.resolve({}));
    projectsDao.update.mockReturnValue(Promise.resolve({}));
    projectsDao.deleteProject.mockReturnValue(Promise.resolve({}));

    test('Projects should call all CRUD functions', async () => {
        let project = {
            name: "name",
            description: "desc"
        };

        let newproject = await projectsDelegate.create(project);
        expect(projectsDao.create).toBeCalled();

        await projectsDelegate.get(newproject.id);
        expect(projectsDao.get).toBeCalled();

        await projectsDelegate.getAll();
        expect(projectsDao.getAll).toBeCalled();

        await projectsDelegate.update(newproject, newproject.id);
        expect(projectsDao.update).toBeCalled();
        
        await projectsDelegate.deleteProject(newproject.id);
        expect(projectsDao.deleteProject).toBeCalled();
    });

    test('Project create should rise error because of wrong parameters', async () => {
        let block = {
            name: "block",
            description: 1
        };

        await expect(projectsDelegate.create(block)).rejects.toThrow();
    });

    test('Project get should rise error because of wrong id params', async () => {
        await expect(projectsDelegate.get({})).rejects.toThrow();
        await expect(projectsDelegate.get('a')).rejects.toThrow();
    });
});