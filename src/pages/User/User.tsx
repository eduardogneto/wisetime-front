import Header from "../../components/Header";
import "./User.sass";
import { Input, Modal, Select, message, Button } from "antd";
import React, { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb.tsx";
import UserTable from "./UserTable.tsx";
import { TopButtons } from "../../components/TopButtons/TopButtons.tsx";
import api from "../../connection/api";

interface Team {
  id: number;
  name: string;
}

const User: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setloadingTeams] = useState(true);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [teamId, setTeamId] = useState<number | null>(null);
  const [tag, setTag] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refresh, setRefresh] = useState(0);
  const organizationId = localStorage.getItem("organizationId");
  const userTag = localStorage.getItem("userTag");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setloadingTeams(true);
        const response = await api.get("/api/users/teams", {
          params: { organizationId },
        });
        setTeams(response.data);
      } catch (error) {
        console.error("Erro ao buscar cargos:", error);
      } finally {
        setloadingTeams(false);
      }
    };

    if (organizationId) {
      fetchTeams();
    }
  }, [organizationId]);

  const showModal = () => {
    if (selectedUsers.length === 1) {
      const selectedUser = selectedUsers[0];
      setName(selectedUser.name);
      setEmail(selectedUser.email);
      setTeamId(selectedUser.team?.id || null);
      setTag(selectedUser.tag);
      setPassword("");
    }
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (
      !email ||
      !name ||
      !teamId ||
      !tag ||
      (selectedUsers.length === 0 && !password)
    ) {
      message.error("Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    const userData: any = {
      email,
      name,
      teamId,
      tag,
    };

    if (!selectedUsers.length || (selectedUsers.length === 1 && password)) {
      userData.password = password;
    }

    if (selectedUsers.length === 1) {
      userData.id = selectedUsers[0].id;
    }

    try {
      if (selectedUsers.length === 1) {
        await api.put(`/auth/users/${selectedUsers[0].id}`, userData);
        message.success("Usuário editado com sucesso!");
      } else {
        await api.post("/auth/register", userData);
        message.success("Usuário registrado com sucesso!");
      }
      setIsModalOpen(false);
      resetFormFields();
      setRefresh((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      message.error("Erro ao registrar ou editar o usuário.");
    }
  };

  const resetFormFields = () => {
    setEmail("");
    setName("");
    setPassword("");
    setTeamId(null);
    setTag("");
    setSelectedUsers([]);
  };

  const handleDelete = async () => {
    const selectedUserIds = selectedUsers.map((user) => user.id);

    if (selectedUserIds.length === 0) {
      message.error("Por favor, selecione um ou mais usuários para deletar.");
      return;
    }

    try {
      await api.delete("/api/users/deleteUsers", {
        data: selectedUserIds,
      });
      message.success("Usuário(s) deletado(s) com sucesso!");
      setRefresh((prev) => prev + 1);
      setSelectedUsers([]);
    } catch (error) {
      console.error(error);
      message.error("Erro ao deletar o(s) usuário(s).");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    resetFormFields();
  };

  return (
    <div>
      <Header />
      <div className="container-wise">
        <div className="table">
          <Breadcrumb />
          <div className="filters-history" style={{ marginTop: 10 }}>
            <div className="left-filters">
              <Input
                size="middle"
                placeholder="Pesquisar"
                prefix={<SearchOutlined style={{ color: "#FF426B" }} />}
                style={{
                  height: 55,
                  borderRadius: 15,
                  backgroundColor: "#192831",
                  border: "none",
                  color: "white",
                  marginRight: 15,
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="right-filters">
              <TopButtons
                handleEdit={showModal}
                handleDelete={handleDelete}
                isEditable={selectedUsers.length === 1}
                isDeletable={selectedUsers.length > 0}
              />
              <div className="button-history">
                <Button
                  onClick={showModal}
                  disabled={userTag !== "ADMINISTRADOR"}
                  style={{
                    marginLeft: 15,
                    opacity: userTag === "ADMINISTRADOR" ? 1 : 0.5,
                  }}
                >
                  <p>Cadastrar</p>
                </Button>
              </div>
            </div>
          </div>
          <UserTable
            onSelectUsers={setSelectedUsers}
            refresh={refresh}
            searchTerm={searchTerm}
          />
          <Modal
            className="modal"
            title={
              selectedUsers.length === 1
                ? "Editar usuário"
                : "Cadastrar novo usuário"
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          ></Modal>
        </div>
      </div>
    </div>
  );
};

export default User;
