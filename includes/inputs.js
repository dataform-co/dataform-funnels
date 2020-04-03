const events = [{
  name: "home",
  sql: "event_name = 'screen' AND (((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'destination')) = 'home')"
}, {
  name: "avatar_start_not_onboarding",
  sql: "event_name = 'avatar_start' AND (((SELECT COALESCE(value.int_value, value.float_value, value.double_value) = 1.0 AS BOOL FROM UNNEST(event_params) WHERE key = 'is_onboarding')) = FALSE)"
}, {
  name: "store_open_from_avatar",
  sql: "event_name = 'store_open' AND  (((SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'store_button_origin')) = 'avatar')"
}];

const funnels = [{
    name: "funnel_1",
    steps: ["home", "avatar_start_not_onboarding", "store_open_from_avatar"]
  },
  {
    name: "funnel_2",
    steps: ["home", "avatar_start_not_onboarding", "store_open_from_avatar"]
  }
];

module.exports = {
  events,
  funnels
}
