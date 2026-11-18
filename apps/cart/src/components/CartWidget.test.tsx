import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CartWidget from './CartWidget';
import ProductList from '../../../catalog/src/components/ProductList';

const shoe = { id: '1', name: 'Tênis Runner', price: 299.9 };
const shirt = { id: '2', name: 'Camiseta Dry', price: 79.9 };

function add(product: unknown) {
  act(() => {
    window.dispatchEvent(new CustomEvent('cart:add', { detail: product }));
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CartWidget', () => {
  it('receives the catalog event and closes on an outside click without losing items', async () => {
    const user = userEvent.setup();
    render(<><ProductList /><CartWidget /></>);
    expect(screen.getByRole('img', { name: shoe.name })).toBeDefined();
    await user.click(screen.getByRole('button', { name: 'Adicionar Tênis Runner ao carrinho' }));
    expect(within(screen.getByRole('dialog')).getByText(shoe.name)).toBeDefined();
    const overlay = document.querySelector('[data-slot="sheet-overlay"]');
    if (!overlay) throw new Error('Sheet overlay not rendered');
    await user.click(overlay);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /Abrir carrinho: 1 itens/ })).toBeDefined();
  });

  it('opens an empty cart, closes with Escape and restores focus', async () => {
    const user = userEvent.setup();
    render(<CartWidget />);
    const trigger = screen.getByRole('button', { name: /Abrir carrinho: 0 itens/ });
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(trigger);
    expect(screen.getByText('Seu carrinho está vazio.')).toBeDefined();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('adds, groups and removes units without changing other products', async () => {
    const user = userEvent.setup();
    render(<CartWidget />);
    add(shoe);
    expect(screen.getByRole('dialog', { name: 'Meu carrinho' })).toBeDefined();
    add(shirt);
    add(shoe);
    const dialog = within(screen.getByRole('dialog'));
    expect(dialog.getAllByRole('listitem')).toHaveLength(2);
    expect(dialog.getByText('Quantidade: 2')).toBeDefined();
    expect(dialog.getByText('Total (3 itens)')).toBeDefined();
    expect(screen.getByRole('button', { name: /Abrir carrinho: 3 itens — R\$\s679,70/ })).toBeDefined();

    await user.click(dialog.getByRole('button', { name: 'Remover uma unidade de Tênis Runner' }));
    expect(dialog.getByText('Total (2 itens)')).toBeDefined();
    await user.click(dialog.getByRole('button', { name: 'Remover uma unidade de Tênis Runner' }));
    expect(dialog.queryByText(shoe.name)).toBeNull();
    expect(dialog.getByText(shirt.name)).toBeDefined();
    expect(screen.getByRole('button', { name: /Abrir carrinho: 1 itens — R\$\s79,90/ })).toBeDefined();

    await user.click(dialog.getByRole('button', { name: 'Remover uma unidade de Camiseta Dry' }));
    expect(dialog.getByText('Seu carrinho está vazio.')).toBeDefined();
    expect(dialog.getByText('Total (0 itens)')).toBeDefined();
    expect(screen.getByRole('button', { name: /Abrir carrinho: 0 itens — R\$\s0,00/ })).toBeDefined();
  });

  it('preserves items on close and reopens automatically on the next add', async () => {
    const user = userEvent.setup();
    render(<CartWidget />);
    add(shoe);
    await user.click(screen.getByRole('button', { name: 'Continuar comprando' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: /Abrir carrinho/ }));
    expect(screen.getByText(shoe.name)).toBeDefined();
    await user.click(screen.getByRole('button', { name: 'Fechar carrinho' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    add(shirt);
    expect(screen.getByRole('dialog')).toBeDefined();
    expect(screen.getByText('Total (2 itens)')).toBeDefined();
  });

  it('calculates totals in cents and accepts a free product', () => {
    render(<CartWidget />);
    add({ id: 'small', name: 'Pequeno', price: 0.1 });
    add({ id: 'small', name: 'Pequeno', price: 0.1 });
    add({ id: 'free', name: 'Brinde', price: 0 });
    expect(screen.getByRole('button', { name: /Abrir carrinho: 3 itens — R\$\s0,20/ })).toBeDefined();
  });

  it('rejects malformed events and removes its listener on unmount', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { unmount } = render(<CartWidget />);
    const invalid = [
      undefined, null, 'invalid', {},
      { ...shoe, id: 1 }, { ...shoe, id: ' ' },
      { id: shoe.id, price: shoe.price }, { ...shoe, name: 1 }, { ...shoe, name: ' ' },
      { id: shoe.id, name: shoe.name }, { ...shoe, price: '10' },
      { ...shoe, price: Number.NaN }, { ...shoe, price: Infinity }, { ...shoe, price: -1 },
    ];
    invalid.forEach(add);
    act(() => { window.dispatchEvent(new Event('cart:add')); });
    expect(error).toHaveBeenCalledTimes(invalid.length + 1);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: /Abrir carrinho: 0 itens/ })).toBeDefined();
    unmount();
    add(null);
    expect(error).toHaveBeenCalledTimes(invalid.length + 1);
  });
});
