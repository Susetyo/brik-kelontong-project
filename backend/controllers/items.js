const { pool } = require("../database/connection");

const getItems = async (req, res) => {
  const client = await pool.connect();
  const queryString = { ...req.query }
  const search = queryString.keyword ? `where name LIKE '%${queryString.keyword}%'` : '';
  // ${search} LIMIT ${queryString.limit} OFFSET ${queryString.offset}
  const queryText = `SELECT sku,name, description, weight, width, length, height, image, harga, category_id, category.category_name FROM item INNER JOIN category ON item.category_id = category.id`;
  try {
    await client.query("BEGIN");
    const result = await client.query(queryText)

    res.status(200).json({
      data: result?.rows ? result?.rows : [] 
    });
    await client.query("COMMIT");
  } catch (err) {
    console.log(err)
    await client.query("ROLLBACK");
    res.status(500).json([]);
  } finally {
    console.log("Releasing database client.");
    client.release();
  }
  return res;
};

const getItemById = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  try {
    await client.query("BEGIN");
    const text = `SELECT sku,name, description, weight, width, length, height, image, harga, category_id, category.category_name 
    FROM item INNER JOIN category ON item.category_id = category.id
    WHERE item.id = $1`
    const values = [id]
    const result = await client.query(text, values);
    res.status(200).json({
      data: result?.rows ? result?.rows : [] 
    });
    await client.query("COMMIT");
  } catch (err) {
    console.log(err)
    await client.query("ROLLBACK");
    res.status(500).json([]);
  } finally {
    console.log("Releasing database client.");
    client.release();
  }
  return res;
};

const createItems = async (req, res) => {
  const client = await pool.connect();
  const {id,sku,name, description, weight, width, length, height, image, harga, category_id} = req.body;
  try {
    await client.query("BEGIN");
    const text = 'INSERT INTO item(id,sku,name,description,weight,width,length,height,image,harga,category_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)'
    const values = [id,sku,name, description, weight, width, length, height, image, harga, category_id]
    const result = await client.query(text, values);
    res.status(200).json(result.rows[0]);
    await client.query("COMMIT");
  } catch (err) {
    console.log(err)
    await client.query("ROLLBACK");
    res.status(500).json([]);
  } finally {
    console.log("Releasing database client.");
    client.release();
  }
  return res;
};

const updateItems = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  const { sku,name, description, weight, width, length, height, image, harga, category_id} = req.body;
  try {
    await client.query("BEGIN");
    const text = `UPDATE item SET sku = $1, 
    name = $2, description = $3,
    weight = $4,width = $5, length = $6, 
    height = $7, image = $8,
    harga = $9 WHERE id = $10`
    const values = [sku,name, description, weight, width, length, height, image, harga, id]
    const result = await client.query(text, values);
    res.status(200).json(result.rows[0]);
    await client.query("COMMIT");
  } catch (err) {
    console.log(err)
    await client.query("ROLLBACK");
    res.status(500).json([]);
  } finally {
    console.log("Releasing database client.");
    client.release();
  }
  return res;
};

const deleteItems = async (req, res) => {
  const client = await pool.connect();
  const { id } = req.params;
  try {
    await client.query("BEGIN");
    const text = `DELETE FROM item WHERE id = $1`
    const values = [id]
    const result = await client.query(text, values);
    res.status(200).json(result.rows[0]);
    await client.query("COMMIT");
  } catch (err) {
    // logger.error("Unexpected error: ", err);
    console.log(err)
    await client.query("ROLLBACK");
    res.status(500).json([]);
  } finally {
    // logger.info("Releasing database client.");
    console.log("Releasing database client.");
    client.release();
  }
  return res;
};





module.exports =  { getItems, createItems, updateItems, getItemById, deleteItems }