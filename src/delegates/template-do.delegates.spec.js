jest.mock(__base + 'dao/template-do.dao');

const templateDoDao = require(__base + 'dao/template-do.dao');
const templateDoDelegate = require('./template-do.delegate');

describe('Template-do delegate', () => {
    templateDoDao.create.mockReturnValue(Promise.resolve({}));
    templateDoDao.get.mockReturnValue(Promise.resolve({}));
    templateDoDao.getAll.mockReturnValue(Promise.resolve({}));
    templateDoDao.update.mockReturnValue(Promise.resolve({}));
    templateDoDao.deleteTemplate.mockReturnValue(Promise.resolve({}));

    test('Template-do tester', () => {
        let template = {};

        templateDoDelegate.create(template);
        expect(templateDoDao.create).toBeCalled();

        templateDoDelegate.get(1);
        expect(templateDoDao.get).toBeCalled();

        templateDoDelegate.getAll();
        expect(templateDoDao.getAll).toBeCalled();

        templateDoDelegate.update(template, 1);
        expect(templateDoDao.update).toBeCalled();
        
        templateDoDelegate.deleteTemplate(1);
        expect(templateDoDao.deleteTemplate).toBeCalled();
    });
});