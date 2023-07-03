const SimpleCryptocurrency = artifacts.require('SimpleCryptocurrency');
const { expect } = require('chai');

contract('SimpleCryptocurrency', (accounts) => {
  let simpleCryptocurrency;
  const initialSupply = 1000;
  const [deployer, recipient] = accounts;

  beforeEach(async () => {
    simpleCryptocurrency = await SimpleCryptocurrency.new(
      'SimpleCoin',
      'SCC',
      initialSupply
    );
  });

  it('should have correct name, symbol, and total supply', async () => {
    const name = await simpleCryptocurrency.name();
    const symbol = await simpleCryptocurrency.symbol();
    const totalSupply = await simpleCryptocurrency.totalSupply();

    expect(name).to.equal('SimpleCoin');
    expect(symbol).to.equal('SCC');
    expect(totalSupply.toNumber()).to.equal(initialSupply);
  });

  it('should transfer tokens between accounts', async () => {
    const transferAmount = 100;
    const senderBalanceBefore = await simpleCryptocurrency.balances(deployer);
    const recipientBalanceBefore = await simpleCryptocurrency.balances(recipient);

    await simpleCryptocurrency.transfer(recipient, transferAmount);

    const senderBalanceAfter = await simpleCryptocurrency.balances(deployer);
    const recipientBalanceAfter = await simpleCryptocurrency.balances(recipient);

    expect(senderBalanceAfter.toNumber()).to.equal(
      senderBalanceBefore.toNumber() - transferAmount
    );
    expect(recipientBalanceAfter.toNumber()).to.equal(
      recipientBalanceBefore.toNumber() + transferAmount
    );
  });

  it('should not allow transferring tokens to an invalid address', async () => {
    const transferAmount = 100;

    await expect(
      simpleCryptocurrency.transfer('0x0000000000000000000000000000000000000000', transferAmount)
    ).to.be.revertedWith('Invalid address');
  });

  it('should not allow transferring tokens with insufficient balance', async () => {
    const transferAmount = initialSupply + 1;

    await expect(
      simpleCryptocurrency.transfer(recipient, transferAmount)
    ).to.be.revertedWith('Insufficient balance');
  });
});
