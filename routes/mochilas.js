const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();

// ✅ Endpoint de prueba
router.get("/test", (req, res) => {
  res.json({ message: "API de mochilas funcionando correctamente" });
});

// ✅ Ruta de LOGIN con Firebase Authentication (POST)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await admin.auth().getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario autenticado correctamente", uid: user.uid });
  } catch (error) {
    res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
  }
});

// ✅ Obtener todas las mochilas
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("mochilas").get();
    const mochilas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(mochilas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las mochilas" });
  }
});

// ✅ Agregar una nueva mochila (Solo Admin)
router.post("/", async (req, res) => {
  try {
    const { nombre, categoria, precio, imagen, stock } = req.body;
    const newMochila = { nombre, categoria, precio, imagen, stock };

    const docRef = await db.collection("mochilas").add(newMochila);
    res.json({ id: docRef.id, ...newMochila });
  } catch (error) {
    res.status(500).json({ error: "Error al agregar la mochila" });
  }
});

// ✅ Editar una mochila existente (Solo Admin)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, precio, imagen, stock } = req.body;

    await db.collection("mochilas").doc(id).update({ nombre, categoria, precio, imagen, stock });
    res.json({ message: "Mochila actualizada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la mochila" });
  }
});

// ✅ Eliminar una mochila (Solo Admin)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("mochilas").doc(id).delete();
    res.json({ message: "Mochila eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la mochila" });
  }
});

module.exports = router;
