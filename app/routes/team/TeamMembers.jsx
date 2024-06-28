import PropTypes from 'prop-types';
import { Form } from '@remix-run/react';
import { Button, Table } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react';

export default function TeamMembers({ members = [], allowRemove = true }) {
  const rows = members.map((row) => {
    return (
      <Table.Tr key={row.username}>
        <Table.Td>{row.name}</Table.Td>
        <Table.Td>{row.username}</Table.Td>
        <Table.Td>{row.createdAt}</Table.Td>
        <Table.Td>{row.updatedAt}</Table.Td>
        {allowRemove ? (
          <Table.Td style={{ textAlign: 'center' }}>
            <Form action="/api/users/remove">
              <input type="hidden" name="u" value={row.username} />
              <Button 
                color="red"
                rightSection={<IconTrash size={16} />}
                type="submit"
              >
                Remove
              </Button>
            </Form>
          </Table.Td>
        ) : null}
      </Table.Tr>
    )
  });

  return (
    <>
      {members.length ? (
        <Table highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Username</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Updated</Table.Th>
              {allowRemove ? (
                <Table.Th style={{ textAlign: 'center' }}>Remove</Table.Th>
              ): null}
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
  allowRemove: PropTypes.bool,
  members: PropTypes.array.isRequired,
};