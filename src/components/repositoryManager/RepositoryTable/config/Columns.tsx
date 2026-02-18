import { GitRepoDto } from '@shared/openapi';

import { EMPTY_CHAR, IS_READ_ONLY } from '@/constants/common';

import { RepositoryEnabledSwitch } from '../ui/RepositoryEnabledSwitch';

export const columns = [
  {
    dataIndex: 'service',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.service || EMPTY_CHAR).localeCompare(b.service || EMPTY_CHAR),
    key: 'service',
    title: 'Service',
    width: '10%',
  },
  {
    dataIndex: 'url',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.url || EMPTY_CHAR).localeCompare(b.url || EMPTY_CHAR),
    key: 'url',
    title: 'Repository URL',
    width: '10%',
  },
  {
    dataIndex: 'authType',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.authType || EMPTY_CHAR).localeCompare(b.authType || EMPTY_CHAR),
    key: 'authorization-type',
    title: 'Authorization type',
    width: '10%',
  },
  {
    dataIndex: 'token',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.token || EMPTY_CHAR).localeCompare(b.token || EMPTY_CHAR),
    key: 'token',
    title: 'Token',
    width: '10%',
  },
  {
    dataIndex: 'login',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.login || EMPTY_CHAR).localeCompare(b.login || EMPTY_CHAR),
    key: 'login',
    title: 'Login',
    width: '10%',
  },
  {
    dataIndex: 'password',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.password || EMPTY_CHAR).localeCompare(b.password || EMPTY_CHAR),
    key: 'password',
    title: 'Password',
    width: '10%',
  },
  {
    dataIndex: 'status',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.status ? 1 : 0) - (b.status ? 1 : 0),
    key: 'status',
    title: 'Status',
    width: '10%',
  },
  {
    dataIndex: 'trackerUrl',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.status ? 1 : 0) - (b.status ? 1 : 0),
    key: 'trackerUrl',
    title: 'Tracker URL',
    width: '10%',
  },
  {
    dataIndex: 'trackerToken',
    sorter: (a: GitRepoDto, b: GitRepoDto) => (a.status ? 1 : 0) - (b.status ? 1 : 0),
    key: 'trackerToken',
    title: 'Tracker token',
    width: '10%',
  },
  // Условно добавляем колонку только если НЕ readOnly
  ...(!IS_READ_ONLY
    ? [
        {
          dataIndex: 'enabled',
          key: 'enabled',
          title: EMPTY_CHAR,
          width: '10%',
          render: (value: boolean, { id }: GitRepoDto) => {
            if (!id) return null;
            return <RepositoryEnabledSwitch value={value} id={id} />;
          },
        },
      ]
    : []),
];
