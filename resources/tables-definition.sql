CREATE TABLE 'Profiles' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
  'firstName' VARCHAR(255) NOT NULL, 
  'lastName' VARCHAR(255) NOT NULL, 
  'profession' VARCHAR(255) NOT NULL, 
  'balance' DECIMAL(12, 2), 
  'type' TEXT, 
  'createdAt' DATETIME NOT NULL, 
  'updatedAt' DATETIME NOT NULL
);

CREATE TABLE 'Contracts' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
  'terms' TEXT NOT NULL, 
  'status' TEXT, 
  'createdAt' DATETIME NOT NULL, 
  'updatedAt' DATETIME NOT NULL, 
  'ContractorId' INTEGER REFERENCES 'Profiles' ('id') ON DELETE SET NULL ON UPDATE CASCADE, 
  'ClientId' INTEGER REFERENCES 'Profiles' ('id') ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE 'Jobs' (
  'id' INTEGER PRIMARY KEY AUTOINCREMENT, 
  'description' TEXT NOT NULL, 
  'price' DECIMAL(12, 2) NOT NULL, 
  'paid' TINYINT(1), 
  'paymentDate' DATETIME, 
  'createdAt' DATETIME NOT NULL, 
  'updatedAt' DATETIME NOT NULL, 
  'ContractId' INTEGER REFERENCES 'Contracts' ('id') ON DELETE SET NULL ON UPDATE CASCADE
);
