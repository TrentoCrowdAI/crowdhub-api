
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
--  //data of the specific block cached
--  input: {},
--  output: {}
-- }
CREATE TABLE cache (
  id bigserial NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  deleted_at timestamp,
  id_workflow bigint NOT NULL,
  id_block bigint NOT NULL,
  data JSONB,
  CONSTRAINT pk_cache PRIMARY KEY (id),
  CONSTRAINT unique_cache UNIQUE (id_workflow, id_block)
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