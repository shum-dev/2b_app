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
        title="Name"
        dataIndex="name"
      />
      <Column
        title="Pastry"
        dataIndex="pastry"
      />
      <Column
        title="Ingredients"
        dataIndex="ingredients"
        render={(val) => val.join(', ')}
      />
      <Column
        title="Author"
        dataIndex="author"
        render={(val) => (val === 'default' ? '-' : val)}
      />
    </Table>
  );
};

export default PizzaList;
