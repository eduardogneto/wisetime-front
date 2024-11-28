import React, { useEffect, useState } from "react";
import { Avatar, Table, Tag } from "antd";
import api from "../../connection/api";

interface Team {
  name: string;
}

interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  organizationId: number;
  team: Team;
  tag: string;
}

interface UserTableProps {
  onSelectUsers: (users: UserResponseDTO[]) => void;
  refresh: number;
  searchTerm: string;
}

const getInitials = (applicant: string) => {
  if (typeof applicant === "string") {
    const nameParts = applicant.split(" ");
    const initials = nameParts.map((part) => part.charAt(0)).join("");
    return initials.substring(0, 2).toUpperCase();
  }
  return "NN";
};

const UserTable: React.FC<UserTableProps> = ({
  onSelectUsers,
  refresh,
  searchTerm,
}) => {
  const [users, setUsers] = useState<UserResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const organizationId = localStorage.getItem("organizationId");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/users/organization", {
        params: { organizationId },
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Erro ao carregar usuários.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchUsers();
    } else {
      setError("Organization ID não encontrado.");
      setLoading(false);
    }
  }, [organizationId, refresh]);

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.team?.name.toLowerCase().includes(search) ||
      user.tag.toLowerCase().includes(search)
    );
  });

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            style={{
              backgroundColor: "#fb003f3d",
              color: "#b30735",
              marginRight: 15,
            }}
          >
            {getInitials(text)}
          </Avatar>
          {text}
        </div>
      ),
    },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Time",
      dataIndex: ["team", "name"],
      key: "teamName",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
      render: (tag: string) => {
        let color = "geekblue";
        if (tag === "COORDENADOR") {
          color = "orange";
        } else if (tag === "FUNCIONARIO") {
          color = "pink";
        }
        return (
          <Tag color={color} key={tag}>
            {tag.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedRows: UserResponseDTO[]) => {
      setSelectedRowKeys(selectedKeys as number[]);
      onSelectUsers(selectedRows);
    },
    type: "checkbox" as "checkbox",
  };

  if (error) return <p>{error}</p>;

  return (
    <Table
      className="tables-wise"
      rowKey="id"
      pagination={false}
      scroll={{ y: 400 }}
      columns={columns}
      dataSource={filteredUsers}
      loading={loading}
      rowSelection={rowSelection}
    />
  );
};

export default UserTable;
