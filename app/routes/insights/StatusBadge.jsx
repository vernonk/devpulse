import PropTypes from 'prop-types';

import { Badge } from '@mantine/core';

// TODO: MOVE THIS TO CONFIGURATION THAT CAN BE IN DB
const STATUS_COLORS = {
  red: ['In Planning', 'Groomed'],
  gray: ['To Do', 'Open', 'Sprint Ready'],
  green: ['Closed', 'Done'],
  grape: ['QA Ready', 'QA In Progress', 'PO Ready'],
  orange: ['Dev in Progress', 'Dev Validation']
};

export default function StatusBadge({ status }) {
  const statusIdx = Object.values(STATUS_COLORS).findIndex((statuses) => statuses.includes(status));
  const color = Object.keys(STATUS_COLORS)[statusIdx];
  return <Badge color={color}>{status}</Badge>;
}

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};