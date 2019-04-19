jest.mock(__base + 'dao/projects.dao');

const projectsDao = require(__base + 'dao/projects.dao');
const projectsDelegate = require('./projects.delegate');

describe('Projects delegate', () => {
    projectsDao.create.mockReturnValue(Promise.resolve({}));
    projectsDao.get.mockReturnValue(Promise.resolve({}));
    projectsDao.getAll.mockReturnValue(Promise.resolve({}));
    projectsDao.update.mockReturnValue(Promise.resolve({}));
    projectsDao.deleteProject.mockReturnValue(Promise.resolve({}));

    test('Projects tester', () => {
        let project = {};

        projectsDelegate.create(project);
        expect(projectsDao.create).toBeCalled();

        projectsDelegate.get(1);
        expect(projectsDao.get).toBeCalled();

        projectsDelegate.getAll();
        expect(projectsDao.getAll).toBeCalled();

        projectsDelegate.update(project, 1);
        expect(projectsDao.update).toBeCalled();
        
        projectsDelegate.deleteProject(1);
        expect(projectsDao.deleteProject).toBeCalled();
    });
});