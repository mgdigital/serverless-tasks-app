BEGIN;

DROP TABLE IF EXISTS tasks, task_lists, task_lists_tasks;

CREATE TABLE IF NOT EXISTS tasks (
  id varchar(36) NOT NULL PRIMARY KEY,
  title text NOT NULL,
  status varchar(36) NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_lists (
  id varchar(36) NOT NULL PRIMARY KEY,
  title text NOT NULL,
  created_at timestamp DEFAULT NOW(),
  updated_at timestamp DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_lists_tasks (
  task_id varchar(36) NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  task_list_id varchar(36) NOT NULL REFERENCES task_lists(id) ON DELETE CASCADE,
  PRIMARY KEY(task_id, task_list_id)
);

COMMIT;
