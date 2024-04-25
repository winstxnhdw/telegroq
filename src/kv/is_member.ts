export const is_member = async (kv: KVNamespace, username: string): Promise<boolean> => {
  const members = await kv.get('members', 'text')
  return members?.split('\n').includes(username) ?? false
}
