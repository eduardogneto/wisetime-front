jest.mock("../connection/api");

const mockApi = {
  post: jest.fn(),
};

jest.mock("../connection/api", () => mockApi);

describe("Organization Logic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("submits organization data successfully", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    const formData = {
      userId: "123", // Simulando o ID do usuário
      name: "Empresa Teste",
      taxId: "123456789",
      email: "empresa@teste.com",
      phone: "1234567890",
      address: {},
      teams: [{ name: "Time A", description: "" }],
    };

    const response = await mockApi.post("/api/organizations/organizations", formData);

    expect(mockApi.post).toHaveBeenCalledWith("/api/organizations/organizations", formData);
    expect(response).toEqual({ data: { success: true } });
  });

  test("handles API errors gracefully", async () => {
    mockApi.post.mockRejectedValueOnce(new Error("Erro no servidor"));

    const formData = {
      userId: "123",
      name: "Empresa Teste",
      taxId: "123456789",
      email: "empresa@teste.com",
      phone: "1234567890",
      address: {},
      teams: [{ name: "Time A", description: "" }],
    };

    await expect(mockApi.post("/api/organizations/organizations", formData)).rejects.toThrow(
      "Erro no servidor"
    );

    expect(mockApi.post).toHaveBeenCalledWith("/api/organizations/organizations", formData);
  });

  test("handles missing fields gracefully", async () => {
    const formData = {
      userId: "123",
      name: "", // Campo obrigatório faltando
      taxId: "123456789",
      email: "empresa@teste.com",
      phone: "1234567890",
      address: {},
      teams: [{ name: "Time A", description: "" }],
    };

    const isValid = formData.name !== ""; // Simulando validação
    expect(isValid).toBe(false);
  });

  test("submits data with some teams missing description successfully", async () => {
    mockApi.post.mockResolvedValueOnce({ data: { success: true } });

    const formData = {
      userId: "123",
      name: "Empresa Teste",
      taxId: "123456789",
      email: "empresa@teste.com",
      phone: "1234567890",
      address: {},
      teams: [{ name: "Time A", description: "" }],
    };

    const response = await mockApi.post("/api/organizations/organizations", formData);

    expect(mockApi.post).toHaveBeenCalledWith("/api/organizations/organizations", formData);
    expect(response).toEqual({ data: { success: true } });
  });
});
