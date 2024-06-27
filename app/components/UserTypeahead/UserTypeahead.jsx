import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CheckIcon,
  Combobox,
  Group,
  Loader,
  Pill,
  PillsInput,
  useCombobox
} from '@mantine/core';
import { placeholder } from 'drizzle-orm';

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

  const abortController = useRef();

  useEffect(() => {
    onSelectionChange(value);
  }, [value]);

  const fetchOptions = async (query) => {
    if (abortController.current) {
      abortController.current.abort();
    }

    abortController.current = new AbortController();
    setLoading(true);
    const data = await getUsers(query, abortController.current.signal);
    setData(data);
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
      {item}
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
                  fetchOptions(event.currentTarget.value);
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
          <Combobox.Option key={user.key} value={user.name} active={value.includes(user.key)}>
            <Group gap="sm">
              {value.includes(user.key) ? <CheckIcon size={12} /> : null}
              <img src={user.avatar} alt={user.name} width={24} height={24} />
              <span>{user.name}</span>
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
  onSelectionChange: PropTypes.func,
  placeholder: PropTypes.string,
};