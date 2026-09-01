import { network } from "hardhat";

const system = {
  scheduler: "0x56e776BAE2DD60664b69Bd5F865F1180ffB7D58B",
  wallet: "0x532F0dF0896F353d8C3DD8cc134e8129DA2a3948",
  registry: "0x9644e8562cE0Fe12b4deeC4163c064A8862Bf47F",
  http: "0x0000000000000000000000000000000000000801",
  jq: "0x0000000000000000000000000000000000000803",
} as const;

const connection = await network.create({ network: "local", chainType: "l1" });
const { viem } = connection;
const publicClient = await viem.getPublicClient();
const testClient = await viem.getTestClient();

for (const [name, address] of [
  ["MockScheduler", system.scheduler],
  ["MockRegistry", system.registry],
  ["MockHttpPrecompile", system.http],
  ["MockJqPrecompile", system.jq],
  ["MockRitualWallet", system.wallet],
] as const) {
  const mock = await viem.deployContract(name);
  const bytecode = await publicClient.getCode({ address: mock.address });
  if (!bytecode) throw new Error(`Missing runtime bytecode for ${name}`);
  await testClient.setCode({ address, bytecode });
}

const registry = await viem.getContractAt("MockRegistry", system.registry);
const http = await viem.getContractAt("MockHttpPrecompile", system.http);
const jq = await viem.getContractAt("MockJqPrecompile", system.jq);
await registry.write.configure(["0x000000000000000000000000000000000000bEEF", true]);
await http.write.configure([200, "0x7b227072696365223a343230307d", ""]);
await jq.write.configure([4200n, true]);

const predict = await viem.deployContract("RitualPredict", [200n]);
console.log(`EXIT_DESK_LOCAL_ADDRESS=${predict.address}`);
await connection.close();
