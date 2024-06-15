import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, message, Select } from 'antd';
import { PlusCircleOutlined, SearchOutlined, FileExcelOutlined } from '@ant-design/icons';
import Header from '../../components/Header';
import api from '../../connection/api';
import * as XLSX from 'xlsx'; // Importa a biblioteca xlsx

import './style.sass';

interface Emblem {
  id: number;
  emblem_details: {
    id: number;
    name: string;
    image: string;
    slug: string;
    category: string;
  };
  emblem_id: number;
  user_id: number;
}

const { Option } = Select;

const Dashboard: React.FC = () => {
  const [emblemsWithDetails, setEmblemsWithDetails] = useState<Emblem[]>([]);
  const [searchData, setSearchData] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchEmblems();
  }, []);

  const fetchEmblems = async () => {
    const userId = localStorage.getItem('id');
    try {
      const response = await api.get<Emblem[]>('find-emblems', {
        params: { userId }
      });
      setEmblemsWithDetails(response.data);
    } catch (error) {
      console.error('Erro ao buscar emblemas:', error);
      message.error('Erro ao buscar emblemas. Tente novamente mais tarde.');
    }
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem('id');
    try {
      const response = await api.post('emblems', { userId });
      message.success(response.data.message);
      fetchEmblems(); // Atualiza os emblemas após a geração de um novo emblema
    } catch (error) {
      console.error('Erro ao gerar emblema:', error);
      message.error('Erro ao gerar emblema. Tente novamente mais tarde.');
    }
  };

  const handleSearch = (value: string) => {
    setSearchData(value);
  };

  const handleCategoryChange = (value: string[]) => {
    setSelectedCategories(value);
  };

  const filterEmblems = (emblems: Emblem[]) => {
    return emblems.filter(emblem => {
      const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(emblem.emblem_details.category);
      const matchSearch = emblem.emblem_details.name.toLowerCase().includes(searchData.toLowerCase());
      return matchCategory && matchSearch;
    });
  };

  const filteredData = filterEmblems(emblemsWithDetails);

  const handleExportExcel = () => {
    const exportData = filteredData.map(emblem => ({
      Nome: emblem.emblem_details.name,
      Categoria: emblem.emblem_details.category,
      Imagem: emblem.emblem_details.image,
      Slug: emblem.emblem_details.slug
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Emblemas');
    XLSX.writeFile(workbook, 'emblemas.xlsx');
  };

  return (
    <div className="content">
      <Header />
      <div className="title-default">
        <h1>Dashboard</h1>
      </div>

      <div className="top-filter">
        <div>
          <Button
            onClick={handleSubmit}
            className="client-button new-client"
            type="primary"
            size="large"
            style={{ backgroundColor: 'rgb(255, 192, 70)', height: "55px" }}
          >
            <PlusCircleOutlined />
            Gerar Emblema
          </Button>
          <FileExcelOutlined title='Exportar' onClick={handleExportExcel} style={{ marginLeft: '10px', fontSize: '24px', color: 'white' }} />
        </div>
        <div className="search-and-category">
          <div className="category-filter">
            <Select
              mode="multiple"
              allowClear
              style={{ minWidth: 200, marginBottom: 10, marginLeft: 10 }}
              placeholder="Selecione as categorias"
              onChange={handleCategoryChange}
            >
              <Option value="gold" >Ouro</Option>
              <Option value="silver" >Prata</Option>
              <Option value="bronze" >Bronze</Option>
            </Select>
          </div>
          <div className="search-dashboard">
            <Input onChange={(e) => handleSearch(e.target.value)} size="middle" placeholder="Pesquisar" prefix={<SearchOutlined />} style={{ marginLeft: 10 }} />
          </div>
        </div>
      </div>

      <div>
        <Row gutter={16}>
          {filteredData.map(emblem => (
            <Col key={emblem.id} className={`gutter-row ${emblem.emblem_details.category}`} span={4}>
              <div className={`grid-background ${emblem.emblem_details.category}`}>
                <img src={emblem.emblem_details.image} alt={`Imagem ${emblem.emblem_id}`} />
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;
