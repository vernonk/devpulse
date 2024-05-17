import { useFetcher } from '@remix-run/react';
import {
  Combobox,
  Loader,
  TextInput,
  useCombobox
} from '@mantine/core';

export default function UserTypeahead() {
  const users = useFetcher();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <users.Form method="get" action="/api/users/$query">
      <Combobox store={combobox} withinPortal={false}>
        <Combobox.Target>
          <TextInput
            label="Search for a user"
            name="q"
            placeholder="search"
            onChange={(event) => {
              users.submit(event.target.form);
              combobox.resetSelectedOption();
              combobox.openDropdown();
            }}
            onClick={() => combobox.openDropdown()}
            onBlur={() => combobox.closeDropdown()}
            rightSection={users.state === 'submitting' ? <Loader /> : null}
          />
        </Combobox.Target>
        <Combobox.Dropdown hidden={!users.data}>
          {users.data?.users.length && users.data?.users.map((user) => (
            <Combobox.Option key={user.key} value={user.name}>
              {user.name}
            </Combobox.Option>
          ))}
          {users.data?.users.length === 0 ? (
            <Combobox.Empty>No users found</Combobox.Empty>
          ) : null}
        </Combobox.Dropdown>
      </Combobox>
    </users.Form>
  );
}