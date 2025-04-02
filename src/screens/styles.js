import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: "100vh", // Faz ocupar a altura toda da tela no web
  },
  content: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content2: {
    backgroundColor: "#fff",
    padding: 20,
  },

  cardsContainer: {
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 50,
    alignSelf: "flex-start", // Alinha o título à esquerda
    marginLeft: 10,
  },
  logoutButton: {
    marginTop: 20, // Espaço acima do botão
    backgroundColor: "#1B3F8F", // Vermelho para indicar logout
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center", // Centraliza o botão
  },

  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 15,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  mainLogo: {
    width: 200,
    height: 80,
    marginBottom: 40,
  },
  loginText: {
    fontSize: 24,
    color: "#084f73",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#1B3F8F",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#084f73",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  header: {
    height: 60,
    backgroundColor: "#041E42",
  },

  logoBranca: {
    width: 80, // Ajuste o tamanho conforme necessário
    height: 50,
    resizeMode: "contain",
    marginHorizontal: 10,
  },
  footer: {
    height: 60,
    backgroundColor: "#041E42",
  },
  footerLogo: {
    width: 150,
    height: 50,
  },
  linksContainer: {
    marginTop: 15,
    alignItems: "center",
    gap: 10,
  },
  signUpLink: {
    color: "#084f73",
    textDecorationLine: "underline",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#0a2463", // Azul escuro
    color: "#fff",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },

  dropdown: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 5,
    marginTop: 5,
  },

  dropdownText: {
    color: "#777",
  },
  picker: {
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginTop: 5,
  },
  // input: {
  //   backgroundColor: '#f0f0f0',
  //   padding: 12,
  //   borderRadius: 5,
  //   marginTop: 5,
  // },

  colaboradorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },

  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "45%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userList: {
    maxHeight: 200,
    marginVertical: 10,
  },
  userItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  selectedUserItem: {
    backgroundColor: "#e3f2fd",
  },
  userText: {
    fontSize: 16,
    color: "#333",
  },
  selectedUserText: {
    color: "#1976d2",
    fontWeight: "bold",
  },
  noUsersText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  disabledButton: {
    opacity: 0.5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  colaboradorItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  colaboradorText: {
    fontSize: 16,
    color: "#333",
  },
  noColaboradoresText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
    alignSelf: "stretch",
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },

  cardContainer: {
    backgroundColor: "#f5f5f5",
    width: "90%",
    marginBottom: 15,
    position: "relative",
  },
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 20,
    minHeight: 100,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },

  menuButton: {
    padding: 8,
    alignSelf: "flex-start", // Alinha os três pontos ao topo
    marginTop: 4, // Pequeno ajuste para alinhar com o título
  },
  menuDots: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },

  scrollView: {
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  servicoItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  servicoText: {
    fontSize: 16,
  },
  downloadButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  downloadButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#007BFF",
    fontSize: 16,
  },

  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    minHeight: "100vh",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  dateButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  datePicker: {
    width: "100%",
    marginBottom: 15,
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    height: "100vh",
    overflow: "auto",
  },

  content2: {
    padding: 20,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },

  backButton: {
    backgroundColor: "#0a2463",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  nextButton: {
    backgroundColor: "#0a2463",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },

  emailInputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  emailInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  colaboradoresList: {
    marginTop: 10,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  colaboradorItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 5,
    marginBottom: 8,
    backgroundColor: "#f9f9f9",
  },
  colaboradorText: {
    flex: 1,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#f44336",
    padding: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "500",
  },
  noColabsText: {
    marginVertical: 20,
    textAlign: "center",
    color: "#666",
    fontStyle: "italic",
  },

  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },

  passwordInput: {
    flex: 1,
    height: 40,
  },

  bold: { fontWeight: "bold", textDecorationLine: "underline", fontSize: 24 },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  disabledButton: { backgroundColor: "#b0b0b0" },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: 24, // Título maior
    fontWeight: "bold",
    flex: 1, // Permite que o título ocupe o espaço disponível
    marginRight: 10, // Espaço entre o título e os três pontos
  },
  deleteButton: {
    backgroundColor: "#00cc00",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#1B3F8F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  addColaboradorButton: {
    backgroundColor: "#00cc00",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  addColaboradorButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  viewColaboradoresButton: {
    backgroundColor: "#0099ff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  viewColaboradoresButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  colaboradorText: {
    fontSize: 16,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "blue",
    fontSize: 16,
  },

  serviceGroup: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceItem: {
    fontSize: 16,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  servicesScrollView: {
    maxHeight: 300,
    width: "100%",
  },
  serviceText: {
    fontSize: 14,
    paddingVertical: 4,
  },
  noServicesText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "#666",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  loader: {
    marginVertical: 20,
  },
  backToLoginButton: {
    marginTop: 20,
  },
  backToLoginText: {
    color: "#3498db",
    fontSize: 16,
    textAlign: "center",
  },
  downloadServiceButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    width: "100%",
  },
  selectedServiceItem: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
    borderWidth: 1,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  stepIndicator: {
    fontSize: 16,
    color: "#2a6099",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },

  logo: {
    width: 200, // Ajuste o tamanho conforme necessário
    height: 200,
    resizeMode: "contain",
    alignSelf: "center", // Para centralizar a logo
    marginBottom: 20,
    marginHorizontal: 20,
  },

  logo2: {
    width: 120, // Ajuste o tamanho conforme necessário
    height: 120,
    resizeMode: "contain",
    alignSelf: "center", // Para centralizar a logo
    marginBottom: 20,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "center", // Centraliza horizontalmente
    alignItems: "center", // Alinha verticalmente
    marginBottom: 20, // Espaço abaixo das logos
  },

  summaryBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
    padding: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#2a6099",
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  summaryText: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default styles;
