import { getErrorMessage, getQueryErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('maps 404 to "Not found"', () => {
    expect(getErrorMessage(404)).toBe('Not found');
  });

  it('maps other 4xx to a generic request-failed message', () => {
    expect(getErrorMessage(400)).toBe('Request failed (400)');
  });

  it('maps 5xx to a server-unavailable message', () => {
    expect(getErrorMessage(500)).toBe('Server is unavailable, please try again later');
  });

  it('falls back to "Unknown error" for non-error statuses', () => {
    expect(getErrorMessage(200)).toBe('Unknown error');
  });
});

describe('getQueryErrorMessage', () => {
  it('returns "Unknown error" when there is no error', () => {
    expect(getQueryErrorMessage(undefined)).toBe('Unknown error');
  });

  it('translates a numeric HTTP status via getErrorMessage', () => {
    expect(getQueryErrorMessage({ status: 500, data: undefined })).toBe(
      'Server is unavailable, please try again later',
    );
  });

  it('reports a network error for a non-numeric status', () => {
    expect(getQueryErrorMessage({ status: 'FETCH_ERROR', error: 'failed' })).toBe(
      'Network error, please check your connection',
    );
  });

  it('uses the message of a serialized error', () => {
    expect(getQueryErrorMessage({ message: 'boom' })).toBe('boom');
  });

  it('falls back to "Unknown error" for a serialized error without a message', () => {
    expect(getQueryErrorMessage({})).toBe('Unknown error');
  });
});
