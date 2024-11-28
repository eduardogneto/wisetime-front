import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Dashboard from "../pages/Dashboard/Dashboard";

jest.mock("../connection/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock("../components/Header", () => () => <div>Header Mock</div>);

jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  message: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

// Suprimir mensagens de erro no console para evitar distrações
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => { });
  jest.spyOn(console, "warn").mockImplementation(() => { });
});

beforeEach(() => {
  jest.clearAllMocks();

  Storage.prototype.getItem = jest.fn((key) => {
    if (key === "name") return "Eduardo";
    if (key === "id") return "123";
    if (key === "tag") return "FUNCIONARIO";
    return null;
  });

  require("../connection/api").get.mockResolvedValue({ data: [] });
  require("../connection/api").post.mockResolvedValue({ data: {} });

  global.navigator.geolocation = {
    getCurrentPosition: jest.fn(),
  };
});

afterAll(() => {
  // Restaurar o comportamento original após os testes
  console.error.mockRestore();
  console.warn.mockRestore();
});

describe("Componente Dashboard", () => {
  test("deve exibir 'Nenhum ponto registrado!' se não houver registros de ponto", async () => {
    await act(async () => {
      render(<Dashboard />);
    });

    expect(screen.getByText("Nenhum ponto registrado!")).toBeInTheDocument();
  });

  test("deve exibir mensagem de erro ao falhar ao obter localização", async () => {
    global.navigator.geolocation.getCurrentPosition = jest.fn((_, error) =>
      error({ code: 1, message: "Permissão negada" })
    );

    await act(async () => {
      render(<Dashboard />);
    });

    expect(
      screen.getByText("Erro ao obter localização. Verifique as permissões.")
    ).toBeInTheDocument();
  });

  test("deve exibir mensagem de sucesso ao registrar uma batida de ponto", async () => {
    require("../connection/api").post.mockResolvedValueOnce({
      status: 200,
    });

    await act(async () => {
      render(<Dashboard />);
    });

    const punchButton = screen.getByRole("button", { name: /Bater Ponto/i });

    fireEvent.click(punchButton);

    await waitFor(() => {
      expect(require("antd").message.success).toHaveBeenCalledWith(
        "Batida de ponto registrada com sucesso!"
      );
    });
  });

  test("deve exibir mensagem de erro ao falhar ao registrar uma batida de ponto", async () => {
    require("../connection/api").post.mockRejectedValueOnce(new Error());

    await act(async () => {
      render(<Dashboard />);
    });

    const punchButton = screen.getByRole("button", { name: /Bater Ponto/i });

    fireEvent.click(punchButton);

    await waitFor(() => {
      expect(require("antd").message.error).toHaveBeenCalledWith(
        "Erro ao registrar a batida de ponto."
      );
    });
  });

  test("deve exibir mensagem de erro ao falhar ao buscar registros de ponto", async () => {
    require("../connection/api").get.mockRejectedValueOnce(new Error());

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(require("antd").message.error).toHaveBeenCalledWith(
        "Erro ao buscar os registros de ponto."
      );
    });
  });

  test("deve exibir mensagem de erro ao buscar os saldos sem usuário ou organização", async () => {
    Storage.prototype.getItem = jest.fn(() => null);

    await act(async () => {
      render(<Dashboard />);
    });

    await waitFor(() => {
      expect(require("antd").message.error).toHaveBeenCalledWith(
        "Erro ao buscar os saldos"
      );
    });
  });
});
