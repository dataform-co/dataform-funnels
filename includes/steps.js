module.exports = (funnel, steps_table) => 
`
WITH step_1 AS (
  SELECT
    *,
    step as step_1,
    timestamp as timestamp_1,
    LEAD (step, 1) OVER (user_event_window) AS step_2,
    LEAD (timestamp, 1) OVER (user_event_window) AS timestamp_2
  FROM 
    ${steps_table}
  WHERE 
    step IN (${funnel.steps.map((s) => `"${s}"`).join(", ")})
),

${[...Array(funnel.steps.length-2).keys()].map((s, i) => `
step_${i+2} AS (
  SELECT
    *,
    LEAD (step_${i+2}, 1) OVER (user_event_window) AS step_${i+3},
    LEAD (timestamp_${i+2}, 1) OVER (user_event_window) AS timestamp_${i+3}
  FROM 
   step_${i+1}
  WHERE 
    step_${i+1} != step_${i+2} OR step_${i+1} IS NULL 
  WINDOW
    user_event_window AS (PARTITION BY ${package_params.events_table_userid} ORDER BY ${package_params.events_table_timestamp})
)
`)}

SELECT
  ${[...package_params.events_table_timestamp,
     ...package_params.events_table_userid, 
     ...package_params.events_table_additional_fields
     ].map((i) => `${i}`).join(",\n  ")},
  "${funnel.name}" AS funnel_id,
  ${funnel.steps.map((step, i) => `
  MAX("${step}") as step_${i+1}_name,
  COUNTIF(${[...Array(i+1).keys()].map((a, i) => `step_${i+1} = "${funnel.steps[i]}"`).join(" and ")}
          AND
          ${[...Array(i).keys()].map((a, i) => `timestamp_${i+2} - timestamp_${i+1} < ${package_params.step_gap_seconds}`).join(" and ")}
          ) AS step_${i+1}_count,
  COUNT(DISTINCT (IF(${[...Array(i+1).keys()].map((a, i) => `step_${i+1} = "${funnel.steps[i]}"`).join(" and ")}
          AND
          ${[...Array(i).keys()].map((a, i) => `timestamp_${i+2} - timestamp_${i+1} < ${package_params.step_gap_seconds}`).join(" and ")}
          , ${package_params.events_table_userid},
           NULL))) AS step_${i+1}_users,
  `)}
FROM 
  step_${funnel.steps.length-1}
GROUP BY 
  1, ${[...package_params.events_table_timestamp,
     ...package_params.events_table_userid, 
     ...package_params.events_table_additional_fields
     ].map((a, i) => `${i+2}`).join(", ")}
`;

