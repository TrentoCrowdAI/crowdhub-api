jest.mock(__base + 'dao/project-collaborations.dao');
require(__base + 'delegates/user-access.delegate.mocked');

const collaborationsDao = require(__base + 'dao/project-collaborations.dao');
const colaborationsDelegate = require('./project-collaborations.delegate');

describe('Project-collaborations delegate', () => {
    collaborationsDao.create.mockImplementation((id_user, id_project) => Promise.resolve({ id: 1, id_user: id_user, id_project: id_project }));
    collaborationsDao.get.mockReturnValue(Promise.resolve({}));
    collaborationsDao.getAllByProject.mockReturnValue(Promise.resolve({}));
    collaborationsDao.deleteCollaboration.mockReturnValue(Promise.resolve({}));

    test('Project-collaborations should call all CRUD functions', async () => {
        let projectId = 1;
        let userId = 'aaaa';

        let collab = await colaborationsDelegate.create(userId, projectId, userId);
        expect(collaborationsDao.create).toBeCalled();

        await colaborationsDelegate.get(collab.id, userId);
        expect(collaborationsDao.get).toBeCalled();

        await colaborationsDelegate.getAllByProject(projectId, userId);
        expect(collaborationsDao.getAllByProject).toBeCalled();
        
        await colaborationsDelegate.deleteCollaboration(collab.id, userId);
        expect(collaborationsDao.deleteCollaboration).toBeCalled();
    });

    test('Project-collaborations create should rise error because of wrong parameters', async () => {
        let projectId ='a';
        let userId = 'aaaa';

        await expect(colaborationsDelegate.create(userId, projectId, userId)).rejects.toThrow();
    });

    test('Project-collaborations get should rise error because of wrong id params', async () => {
        let userId = 'aaaa';
        await expect(colaborationsDelegate.get({}, userId)).rejects.toThrow();
        await expect(colaborationsDelegate.get('a', userId)).rejects.toThrow();
    });
});