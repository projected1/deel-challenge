# api-testing

## Get User Contract (user owns the contract)
```sh
curl -v "http://localhost:3001/contracts/4" -H "profile_id: 7" | jq
```

## Get User Contract (user doesn't own the contract)
```sh
curl -v "http://localhost:3001/contracts/1" -H "profile_id: 7" | jq
```

## Get All Contracts (3)
```sh
curl -v "http://localhost:3001/contracts" -H "profile_id: 7" | jq
```

## Get All Contracts (0)
```sh
curl -v "http://localhost:3001/contracts" -H "profile_id: 5" | jq
```

## Make a Deposit (valid)
```sh
curl -v "http://localhost:3001/balances/deposit/4" -H "profile_id: 4" -H "Content-Type: application/json" -d '{"amount":"5"}' | jq
```

## Make a Deposit (invalid)
```sh
curl -v "http://localhost:3001/balances/deposit/4" -H "profile_id: 4" -H "Content-Type: application/json" -d '{"amount":"5000"}' | jq
```

## Get Unpaid Jobs (2)
```sh
curl -v "http://localhost:3001/jobs/unpaid" -H "profile_id: 7" | jq
```

## Get Unpaid Jobs (0)
```sh
curl -v "http://localhost:3001/jobs/unpaid" -H "profile_id: 5" | jq
```

## Client Releases Job Payment
```sh
curl -v -X POST "http://localhost:3001/jobs/1/pay" -H "profile_id: 1" | jq
```

## Find Best Payed Profession in Date Range (1)
```sh
curl -v "http://localhost:3001/admin/best-profession?start=2020-08-15T19:11:26.737Z&end=2022-08-15T19:11:26.737Z" | jq
```

## Find Best Payed Profession in Date Range (0)
```sh
curl -v "http://localhost:3001/admin/best-profession?start=2022-07-15T19:11:26.737Z&end=2022-08-15T19:11:26.737Z" | jq
```

## Find Best Paying Clients in Date Range (limit 4)
```sh
curl -v "http://localhost:3001/admin/best-clients?start=2020-08-15T19:11:26.737Z&end=2022-08-15T19:11:26.737Z&limit=4" | jq
```

## Find Best Paying Clients in Date Range (default limit 2)
```sh
curl -v "http://localhost:3001/admin/best-clients?start=2020-08-15T19:11:26.737Z&end=2022-08-15T19:11:26.737Z" | jq
```
