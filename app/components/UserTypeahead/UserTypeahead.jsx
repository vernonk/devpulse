import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Combobox,
  Group,
  Loader,
  Pill,
  PillsInput,
  useCombobox
} from '@mantine/core';

function getUsers(query, signal) {
  return new Promise((res, rej) => {
    signal.addEventListener('abort', () => {
      console.log('aborting!');
      rej(new Error('Request aborted'));
    });
    fetch(`/api/users?q=${query}`)
      .then((response) => response.json())
      .then(res)
      .catch(rej);
  });
}

export default function UserTypeahead({
  getResetCombo = undefined,
  excludedValues = [],
  onSelectionChange = () => {},
  placeholder = 'Search users',
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState([]);

  if (getResetCombo) {
    getResetCombo(() => {
        combobox.resetSelectedOption();
        setData([]);
        setSearch('');
        setValue([]);
    });
  }

  const abortController = useRef();

  useEffect(() => {
    onSelectionChange(value);
  }, [onSelectionChange, value]);

  const fetchOptions = async (query, existingValues) => {
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    const data = await getUsers(query, abortController.current.signal);
    const filteredUsers = data.users.filter((user) => {
      const value = `${user.name}:${user.displayName}`;
      return !existingValues.includes(value) && !excludedValues.includes(value);
    });
    setData({
      ...data,
      users: filteredUsers,
    });
    setLoading(false);
    abortController.current = undefined;
  };

  const handleValueSelect = (val) =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );

  const handleValueRemove = (val) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {item.split(':')[1]}
    </Pill>
  ));

  return (
    <Combobox 
      onOptionSubmit={(option) => {
        handleValueSelect(option);
        setSearch('');
        combobox.closeDropdown();
      }}
      
      store={combobox}
      withinPortal={false}
    >
      <Combobox.DropdownTarget>
        <PillsInput>
          <Pill.Group>
            {values}
            <Combobox.EventsTarget>
              <PillsInput.Field
                name="q"
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={placeholder}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                  fetchOptions(event.currentTarget.value, value);
                  combobox.openDropdown();
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && search.length === 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
            {loading ? <Loader size={18} /> : null}
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>
      <Combobox.Dropdown>
        {data?.users?.length ? data?.users.map((user) => (
          <Combobox.Option 
            key={user.key}
            value={`${user.name}:${user.displayName}`}
            active={value.includes(user.key)}
          >
            <Group gap="sm">
              <img src={user.avatarUrl} alt={user.displayName} width={24} height={24} />
              <span>{user.displayName}</span>
            </Group>
          </Combobox.Option>
        )) : null}
        {data?.users?.length === 0 ? (
          <Combobox.Empty>No users found</Combobox.Empty>
        ) : null}
      </Combobox.Dropdown>
    </Combobox>
  );
}

UserTypeahead.propTypes = {
  getResetCombo: PropTypes.func,
  excludedValues: PropTypes.arrayOf(PropTypes.string),
  onSelectionChange: PropTypes.func,
  placeholder: PropTypes.string,
};