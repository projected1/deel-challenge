# sql-queries

## Find Best Payed Profession

Sequalize:

```sql
select Contractor.profession, sum(Jobs.price) as totalEarned
from Contracts as Contract
  inner join Jobs as Jobs on Contract.id = Jobs.ContractId
  and Jobs.paymentDate between '2020-08-15 19:11:26.737 +00:00' and '2022-08-15 19:11:26.737 +00:00'
  inner join Profiles as Contractor on Contract.ContractorId = Contractor.id
group by Contractor.profession
order by totalEarned desc
limit 1;
```

Custom:

```sql
select p.profession, sum(j.price) as totalEarned
from Jobs j, Contracts c, Profiles p
where j.paymentDate between '2020-08-15 19:11:26.737 +00:00' and '2022-08-15 19:11:26.737 +00:00'
  and j.ContractId = c.id
  and c.ContractorId = p.id
group by p.profession
order by totalEarned desc
limit 1;
```

## Find Best Paying Clients

Sequalize:

```sql
select
  Client.id,
  Client.firstName || " " || Client.lastName as fullName,
  sum(Jobs.price) as paid
from
  Contracts as Contract
  inner join Jobs as Jobs on Contract.id = Jobs.ContractId
  and Jobs.paymentDate between '2020-08-15 19:11:26.737 +00:00' and '2022-08-15 19:11:26.737 +00:00'
  inner join Profiles as Client on Contract.ClientId = Client.id
group by Client.id
order by paid desc, Contract.id
limit 4;
```

Custom:

```sql
select p.id, p.firstName || " " || p.lastName as fullName, sum(j.price) as paid
from Jobs j, Contracts c, Profiles p
where j.paymentDate between '2020-08-15 19:11:26.737 +00:00' and '2022-08-15 19:11:26.737 +00:00'
  and j.ContractId = c.id
  and c.ClientId = p.id
group by p.id
order by paid desc, c.id
limit 4;
```
