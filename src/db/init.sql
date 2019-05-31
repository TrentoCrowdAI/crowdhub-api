
-- data: {
--  name: <string>, 
--	description: <string>, 
--	numVotes: <number>,  // votes per item
--	maxVotes: <number>,  // max votes per worker
--	reward: <number>,        // how much we pay per vote
-- }
CREATE TABLE project (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_user varchar(80) NOT NULL, -- google_id
  data JSONB,
  CONSTRAINT pk_proj PRIMARY KEY (id)
);


-- data: {
--  name: <string>,
--  blocks: [
--    {
--      id: <string>, //id of the block
--      data: {
--			  type: "Qrand", //the type of the block
--			  toCache: <bbolean>, //if the block has to be cached or not
--			  //other specific block params
--		  },
--		  children: [ <number> ] // the children blocks of this block
--    }
--  ]
-- }
CREATE TABLE workflow (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_project bigint NOT NULL,
  data JSONB,
  CONSTRAINT pk_workflow PRIMARY KEY (id)
);


-- data: {
--  id_block: {
--    id_cache: <number>,
--    state: <string> //running, finished
--  }
-- }
CREATE TABLE run (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_workflow bigint NOT NULL,
  data JSONB,
  CONSTRAINT pk_run PRIMARY KEY (id)
);


-- data: {
--  //data of the specific block cached
--  input: {},
--  output: {}
-- }
CREATE TABLE cache (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_run bigint NOT NULL,
  data JSONB,
  CONSTRAINT pk_cache PRIMARY KEY (id)
);


-- data: {
--  prop: <string> //property-value in F8 standard
-- }
CREATE TABLE item (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_project bigint NOT NULL,
  data JSONB,
  CONSTRAINT pk_item PRIMARY KEY (id)
);


-- data: {
--  name: <string>, //name of the template,
--	instructions: <string>   // html/text content for the instructions of the task
--  blocks: [
--    {
--      type: "input_dynamic_text",
--      ...
--    }
--  ]
-- }
CREATE TABLE template_do (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_template_do PRIMARY KEY (id)
);


-- data: {
--  name: <string>, //name of the block-type,
--  builtIn: <boolean>,
--	parameters: [{name: <string>, description: <string>, type: <string>, choices: []}]
-- }
CREATE TABLE block_type (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_block_type PRIMARY KEY (id)
);



CREATE TABLE workers_of_workflow (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_context varchar(100),
  id_worker varchar(100),
  id_workflow bigint,
  data JSONB,
  CONSTRAINT pk_workers_of_worflow PRIMARY KEY (id),
  CONSTRAINT unique_workers_of_worflow UNIQUE(id_workflow, id_context, id_worker)
);

-- data: {
--  email: <string>,
--  fullName: <string>,
--  picture: <string>, //url
--  name: <string>,
--  surname: <string>,
--  locale: <string> //like 'it'
-- }
CREATE TABLE users (
  id varchar(80) NOT NULL, -- google_id
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  data JSONB,
  CONSTRAINT pk_user PRIMARY KEY (id)
);

-- table used for adding collaborators to a project
CREATE TABLE project_collaborations (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_user varchar(80) NOT NULL,
  id_project bigint NOT NULL,
  CONSTRAINT pk_project_collaborations PRIMARY KEY (id),
  CONSTRAINT unique_project_collaborations UNIQUE (id_user, id_project)
);