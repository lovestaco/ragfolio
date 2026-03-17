# SQLite’s Flexible Typing: Storage Types and Column Affinity




In the previous post, we discussed **datatype management inside SQLite’s Virtual Machine (VM)** and how the VM is responsible for assigning storage types and performing conversions. Today we take a deeper look at two key concepts that make SQLite unique among database systems:

* **Storage type determination**
* **Column affinity determination**

Together, these explain why SQLite is often described as **“typeless”** and how it still manages to remain compatible with traditional SQL databases.


## Storage Type Determination

SQLite is frequently described as a **typeless database engine**. This means it does not enforce strict domain constraints on table columns. 

In most cases, **any type of value can be stored in any column**, regardless of the column’s declared SQL type.

There is one notable exception: the **INTEGER PRIMARY KEY column** (the `rowid`). This column can only store integer values. If the VM encounters a value that cannot be interpreted as an integer for this column, the insertion is rejected.

SQLite even allows tables to be created **without specifying column types at all**:

```sql
CREATE TABLE T1(a, b, c);
```

Since there is no strict typing requirement, the question becomes:
**How does SQLite decide what storage type a value should have?**

The VM determines the initial storage type based on how the value enters the system.


### 1. Values Specified as SQL Literals

When a value appears directly in an SQL statement, SQLite determines its storage type according to its syntax.

Examples:

* **TEXT**
  Values enclosed in quotes are interpreted as strings.

```sql
INSERT INTO t1 VALUES('hello');
```

* **INTEGER**
  Unquoted numbers without a decimal point or exponent.

```sql
INSERT INTO t1 VALUES(123);
```

* **REAL**
  Numbers containing a decimal point or exponent.

```sql
INSERT INTO t1 VALUES(3.14);
INSERT INTO t1 VALUES(2e5);
```

* **NULL**

```sql
INSERT INTO t1 VALUES(NULL);
```

* **BLOB**

```sql
INSERT INTO t1 VALUES(X'ABCD');
```

In this notation, the hexadecimal digits define the raw byte sequence stored in the database.

If a value does not match any of these patterns, the VM rejects it and query execution fails.

![image](https://hackmd.io/_uploads/ByByerPYZe.png)

### 2. Values Bound Through API Functions

Values can also enter SQLite through parameter binding using the `sqlite3_bind_*` API family.

For example:

```c
sqlite3_bind_int(...)
sqlite3_bind_text(...)
sqlite3_bind_blob(...)
```

Each binding function explicitly determines the storage type:

* `sqlite3_bind_int` → INTEGER
* `sqlite3_bind_double` → REAL
* `sqlite3_bind_text` → TEXT
* `sqlite3_bind_blob` → BLOB

In this case, SQLite simply uses the storage type closest to the native type provided by the application.


## Expression Result Types

Values produced during query execution such as results of expressions or function calls do not have predetermined types during statement preparation.

Instead, their storage types are determined **at runtime**.

For example:

```sql
SELECT 10 + '20';
```

The VM evaluates the expression and assigns a storage type based on the operator and the computed result.

Similarly, user-defined SQL functions may return values with any storage type.


## Column Affinity Determination

Although SQLite is typeless, it still tries to remain compatible with traditional SQL databases that use **static typing**.

To achieve this, SQLite introduces the concept of **column affinity**.

Column affinity is **not a strict rule**, but rather a **recommendation** about the preferred storage type for values stored in a column.

In other words:

> The column’s declared type influences how SQLite tries to convert values, but it does not strictly restrict them.

Each column belongs to one of five affinity categories:

* **TEXT**
* **NUMERIC**
* **INTEGER**
* **REAL**
* **NONE**

Note that some names (TEXT, INTEGER, REAL) are also used as storage types internally. Context determines whether we are referring to **affinity** or **storage type**.


## How SQLite Determines Column Affinity

SQLite determines column affinity by inspecting the declared SQL type in the `CREATE TABLE` statement.

The VM checks the declaration using the following rules, evaluated in order:

### 1. INTEGER affinity

If the declared type contains the substring **INT**, the column receives **INTEGER affinity**.

Examples:

```sql
INT
INTEGER
BIGINT
SMALLINT
```
 

### 2. TEXT affinity

If the declared type contains **CHAR**, **CLOB**, or **TEXT**, the column receives **TEXT affinity**.

Examples:

```sql
CHAR
VARCHAR
TEXT
CLOB
```

Note that `VARCHAR` contains the substring `CHAR`, so it also maps to TEXT affinity.
 

### 3. NONE affinity

If the declared type contains **BLOB**, or if **no type is specified**, the column receives **NONE affinity**.

Examples:

```sql
BLOB
CREATE TABLE t1(a);
```
 

### 4. REAL affinity

If the declared type contains **REAL**, **FLOA**, or **DOUB**, the column receives **REAL affinity**.

Examples:

```sql
REAL
FLOAT
DOUBLE
DOUBLE PRECISION
```
 

### 5. NUMERIC affinity

If none of the previous rules match, the column receives **NUMERIC affinity**.

Examples:

```sql
DECIMAL
BOOLEAN
DATE
NUMERIC
```
 

## Order of Evaluation Matters

SQLite applies these rules **in order**, and the pattern matching is **case-insensitive**.

For example:

```sql
BLOBINT
```

Even though it contains the substring `BLOB`, the substring `INT` appears earlier in the rule list. Therefore, the column receives **INTEGER affinity**, not NONE.

SQLite is intentionally forgiving—even misspelled type declarations still map to some affinity.
 

## CREATE TABLE AS SELECT

Another interesting case occurs when tables are created using:

```sql
CREATE TABLE new_table AS SELECT ...
```

In this case:

* The **declared type** of each column is derived from the **affinity of the expression** in the SELECT clause.
* Default values for these columns are **NULL**.
* The implicit `rowid` column always has **INTEGER** type and cannot be NULL.
 
 
## What’s Coming Next

Now that we understand:

* How SQLite assigns **storage types**
* How it determines **column affinity**

we can finally examine how these rules interact during query execution.

In the next post, we’ll walk through **data conversion with a simple example** and see how the VM dynamically converts values when evaluating SQL expressions.

