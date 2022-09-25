import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EventEmitter } from '../src/utils/event-emitter';

describe('EventEmitter', () => {
  let eventEmitter: EventEmitter;

  beforeEach(() => {
    eventEmitter = new EventEmitter();
  });

  it('should emit an event', () => {
    const listener = vi.fn();

    eventEmitter.on('test', listener);
    eventEmitter.emit('test');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should emit an event with arguments', () => {
    const listener = vi.fn();

    eventEmitter.on('test', listener);
    eventEmitter.emit('test', 'foo', 'bar');

    expect(listener).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should emit an event with multiple listeners', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventEmitter.on('test', listener1);
    eventEmitter.on('test', listener2);
    eventEmitter.emit('test');

    expect(listener1).toHaveBeenCalledTimes(1);
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should emit an event with multiple listeners and arguments', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventEmitter.on('test', listener1);
    eventEmitter.on('test', listener2);
    eventEmitter.emit('test', 'foo', 'bar');

    expect(listener1).toHaveBeenCalledWith('foo', 'bar');
    expect(listener2).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should turn off an event', () => {
    const listener = vi.fn();

    eventEmitter.on('test', listener);
    eventEmitter.off('test', listener);
    eventEmitter.emit('test');

    expect(listener).not.toHaveBeenCalled();
  });

  it('should turn off an event with multiple listeners', () => {
    const listener1 = vi.fn();
    const listener2 = vi.fn();

    eventEmitter.on('test', listener1);
    eventEmitter.on('test', listener2);
    eventEmitter.off('test', listener1);
    eventEmitter.emit('test');

    expect(listener1).not.toHaveBeenCalled();
    expect(listener2).toHaveBeenCalledTimes(1);
  });

  it('should call a listener only once', () => {
    const listener = vi.fn();

    eventEmitter.once('test', listener);
    eventEmitter.emit('test');
    eventEmitter.emit('test');

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should call a listener only once with arguments', () => {
    const listener = vi.fn();

    eventEmitter.once('test', listener);
    eventEmitter.emit('test', 'foo', 'bar');
    eventEmitter.emit('test', 'foo', 'bar');

    expect(listener).toHaveBeenCalledWith('foo', 'bar');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
