import PropTypes from 'prop-types';
import { Table } from '@mantine/core';

import StatusBadge from './StatusBadge';

// TODO... update query to expand on changelog in initial query may be able to get all that data in onego
// IT WORKS :) Update logic to remove details button, add data in initial data set

export default function MetricsTable({
  data,
}) {
  console.log('data', data);
  const rows = data.issues.map((issue) => (
    <Table.Tr key={issue.key}>
      <Table.Td className="nowrap">
        <a href={issue.link} target="_blank" rel="noreferrer">{issue.key}</a>
      </Table.Td>
      <Table.Td><StatusBadge status={issue.fields.status.name} /></Table.Td>
      <Table.Td className="nowrap">{issue.timeInProgress}</Table.Td>
      <Table.Td className="nowrap">{issue.timeInValidation}</Table.Td>
      <Table.Td className="nowrap">{issue.timeInFixIssues}</Table.Td>
      <Table.Td>{issue.fields.summary}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Issue</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Time In Progress</Table.Th>
          <Table.Th>Time In Validation</Table.Th>
          <Table.Th>Time In Fix Issues</Table.Th>
          <Table.Th>Summary</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

MetricsTable.propTypes = {
  data: PropTypes.shape({
    issues: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      fields: PropTypes.shape({
        status: PropTypes.shape({
          name: PropTypes.string.isRequired,
        }).isRequired,
        summary: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired).isRequired,
  }).isRequired,
};