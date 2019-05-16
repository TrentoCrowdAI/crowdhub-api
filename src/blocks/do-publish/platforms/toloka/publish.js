const { createProject, createTaskPool, createTasks, startPool } = require(__base + 'platform-api/toloka');
const renderDesign = require('./render');

/**
 * Publish the workflow on the Toloka platform as a new project.
 * @param {{}} blockData The data of the block of the workflow 
 * @param {[]} input The input items to publish
 */
const publish = async (blockData, input) => {
  let design = renderDesign(blockData.jobDesign.blocks);
  let project = await createProject(blockData, design, blockData.sandbox);

  project.taskPool = await createTaskPool(blockData, project, blockData.sandbox);

  let tasks = await itemsToTasks(project.taskPool, input, design, blockData.sandbox);
  
  project.tasks = await createTasks(tasks, blockData.sandbox);

  project.start = await startPool(project.taskPool, blockData.sandbox);

  return project;
};

module.exports = publish;
