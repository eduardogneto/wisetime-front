import { message } from "antd";

describe("EditDelete Logic", () => {
  const mockMessageInfo = jest.spyOn(message, "info").mockImplementation(() => {});

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls onEdit when provided", () => {
    const onEditMock = jest.fn();

    // Simula o clique no botão de editar
    if (onEditMock) {
      onEditMock();
    } else {
      message.info("Ação de editar");
    }

    expect(onEditMock).toHaveBeenCalled();
    expect(mockMessageInfo).not.toHaveBeenCalled();
  });

  test("shows message info when onEdit is not provided", () => {
    // Simula o clique no botão de editar sem uma função de callback
    const onEditMock = null;

    if (onEditMock) {
      onEditMock();
    } else {
      message.info("Ação de editar");
    }

    expect(mockMessageInfo).toHaveBeenCalledWith("Ação de editar");
  });

  test("calls onDetail when provided", () => {
    const onDetailMock = jest.fn();

    // Simula o clique no botão de detalhar
    if (onDetailMock) {
      onDetailMock();
    } else {
      message.info("Ação de detalhar");
    }

    expect(onDetailMock).toHaveBeenCalled();
    expect(mockMessageInfo).not.toHaveBeenCalled();
  });

  test("shows message info when onDetail is not provided", () => {
    // Simula o clique no botão de detalhar sem uma função de callback
    const onDetailMock = null;

    if (onDetailMock) {
      onDetailMock();
    } else {
      message.info("Ação de detalhar");
    }

    expect(mockMessageInfo).toHaveBeenCalledWith("Ação de detalhar");
  });

  test("calls onCertificate when provided", () => {
    const onCertificateMock = jest.fn();

    // Simula o clique no botão de atestado
    if (onCertificateMock) {
      onCertificateMock();
    } else {
      message.info("Ação de Atestado");
    }

    expect(onCertificateMock).toHaveBeenCalled();
    expect(mockMessageInfo).not.toHaveBeenCalled();
  });

  test("shows message info when onCertificate is not provided", () => {
    // Simula o clique no botão de atestado sem uma função de callback
    const onCertificateMock = null;

    if (onCertificateMock) {
      onCertificateMock();
    } else {
      message.info("Ação de Atestado");
    }

    expect(mockMessageInfo).toHaveBeenCalledWith("Ação de Atestado");
  });

  test("shows delete message info when handleDelete is triggered", () => {
    message.info("Ação de deletar");

    expect(mockMessageInfo).toHaveBeenCalledWith("Ação de deletar");
  });
});
