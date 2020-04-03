const events_table = "javascript.tracks";

const events_table_timestamp = ["timestamp"]; // todo: make this a string

const events_table_userid = ["user_id"]; // todo: make this a string

const events_table_additional_fields = ["country"];

const step_gap_seconds = 15 * 60 * 1000 * 1000;

module.exports = {
  events_table,
  events_table_timestamp,
  events_table_userid,
  events_table_additional_fields,
  step_gap_seconds
}
