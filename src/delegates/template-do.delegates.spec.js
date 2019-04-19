jest.mock(__base + 'dao/template-do.dao');

const templateDoDao = require(__base + 'dao/template-do.dao');
const templateDoDelegate = require('./template-do.delegate');

describe('Template-do delegate', () => {
    templateDoDao.create.mockImplementation((templ) => Promise.resolve({ id: 1, data: templ }));
    templateDoDao.get.mockReturnValue(Promise.resolve({}));
    templateDoDao.getAll.mockReturnValue(Promise.resolve({}));
    templateDoDao.update.mockReturnValue(Promise.resolve({}));
    templateDoDao.deleteTemplate.mockReturnValue(Promise.resolve({}));

    test('Template-do should call all CRUD functions', async () => {
        let template = {
            name: "name",
            instructions: "instr",
            blocks: [{
                type: "input_static_text"
            }]
        };

        let newTemplate = await templateDoDelegate.create(template);
        expect(templateDoDao.create).toBeCalled();

        await templateDoDelegate.get(newTemplate.id);
        expect(templateDoDao.get).toBeCalled();

        await templateDoDelegate.getAll();
        expect(templateDoDao.getAll).toBeCalled();

        await templateDoDelegate.update(newTemplate, newTemplate.id);
        expect(templateDoDao.update).toBeCalled();

        await templateDoDelegate.deleteTemplate(newTemplate.id);
        expect(templateDoDao.deleteTemplate).toBeCalled();
    });

    test('Template-do create should rise error because no name given', async () => {
        let template = {
            instructions: "instr",
            blocks: [{
                type: "input_static_text"
            }]
        };

        await expect(templateDoDelegate.create(template)).rejects.toThrow();
    });

    test('Template-do create should rise error because of wrong blocks', async () => {
        let template = {
            name: "name",
            instructions: "instr",
            blocks: [{
                type: 1
            }]
        };

        await expect(templateDoDelegate.create(template)).rejects.toThrow();
    });

    test('Template-do get should rise error because of wrong id params', async () => {
        await expect(templateDoDelegate.get({})).rejects.toThrow();
        await expect(templateDoDelegate.get('a')).rejects.toThrow();
    });
});