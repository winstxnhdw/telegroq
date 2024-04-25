export const is_not_member = async (kv: KVNamespace, username: string): Promise<boolean> => {
  const usernames = await kv.get('members', 'text')
  return !usernames || !usernames.split('\n').includes(username)
}
