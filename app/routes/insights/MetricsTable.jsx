import PropTypes from 'prop-types';

import { Table } from '@mantine/core';

import StatusBadge from './StatusBadge';

export default function MetricsTable({ data }) {
  const rows = data.issues.map((issue) => (
    <Table.Tr key={issue.key}>
      <Table.Td>
        <span style={{ textWrap: 'nowrap' }}>{issue.key}</span>
      </Table.Td>
      <Table.Td><StatusBadge status={issue.fields.status.name} /></Table.Td>
      <Table.Td>{issue.fields.summary}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table highlightOnHover striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Issue Key</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Summary</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

MetricsTable.propTypes = {
  data: PropTypes.array.isRequired,
};