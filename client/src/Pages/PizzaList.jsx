import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import uniqid from 'uniqid';

import { getAllPizzas } from '../api/pizzas';

const { Column } = Table;

const PizzaList = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllPizzas()
      .then((res) => setData(res.data))
      .catch((err) => console.log('Error: ', err));
  }, []);

  return (
    <Table
      dataSource={data}
      bordered
      rowKey={() => uniqid.time()}
      loading={!data.length}
      size="small"
      pagination={false}
    >
      <Column
        title="Наименование"
        dataIndex="name"
      />
      <Column
        title="Тесто"
        dataIndex="pastry"
      />
      <Column
        title="Тесто"
        dataIndex="ingredients"
        render={(val) => val.join(', ')}
      />
      <Column
        title="Автор"
        dataIndex="author"
        render={(val) => (val === 'default' ? '-' : val)}
      />
    </Table>
  );
};

export default PizzaList;
