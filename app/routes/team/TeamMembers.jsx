import PropTypes from 'prop-types';
import { Table } from '@mantine/core';

export default function TeamMembers({ members = [] }) {
  const rows = members.map((row) => (
    <Table.Tr key={row.username}>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.username}</Table.Td>
      <Table.Td>{row.created_at}</Table.Td>
      <Table.Td>{row.updated_at}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      {members.length ? (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Updated</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      ) : (
        <p>No members found</p>
      )}
    </>
  );
}

TeamMembers.propTypes = {
  members: PropTypes.array.isRequired,
};